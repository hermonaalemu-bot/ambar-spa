-- Phase 1: additive-only prep for real authentication. Safe to run at any time —
-- nothing here changes existing behavior until the app code and Phase 2 policies
-- (20260826000002_lockdown.sql) are both in place.
--
-- Applied to the live project via the Supabase SQL Editor on 2026-08-26.

alter table staff add column if not exists user_id uuid references auth.users(id);

create unique index if not exists staff_user_id_key on staff(user_id);

-- Lets policies and functions check "who is this, and are they active staff" without
-- ever touching a password.
create or replace function public.current_staff_role() returns text
language sql stable security definer set search_path = public as $$
  select role from staff where user_id = auth.uid() and active = true limit 1;
$$;

create or replace function public.is_active_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select exists(select 1 from staff where user_id = auth.uid() and active = true);
$$;

revoke all on function public.current_staff_role() from public, anon;
grant execute on function public.current_staff_role() to authenticated;
revoke all on function public.is_active_staff() from public, anon;
grant execute on function public.is_active_staff() to authenticated;

-- Narrow, safe public view for the unauthenticated "Today's Bookings" screen —
-- exposes only what a walk-in customer would see on a printed sign, nothing else.
create or replace view public_today_bookings as
select customer_name, time, service_name, gender, people, status
from bookings
where date = to_char(now() at time zone 'Africa/Addis_Ababa', 'YYYY-MM-DD')
  and status not in ('Cancelled','No-show');

grant select on public_today_bookings to anon;

-- Closes the double-booking race condition at the database level: two reception
-- terminals can no longer both save the same customer at the same date+time.
create unique index if not exists bookings_no_exact_dup
  on bookings(customer_phone, date, time)
  where status not in ('Cancelled','No-show','Completed');

-- Atomic, all-or-nothing pay period close — replaces a loop that updated employees
-- one row at a time and could leave the period half-closed on a failure partway through.
create or replace function public.close_pay_period(p_period text, p_start date, p_end date, p_snapshot jsonb)
returns void
language plpgsql security definer set search_path = public as $$
begin
  if current_staff_role() is distinct from 'manager' then
    raise exception 'Only managers can close a pay period';
  end if;
  insert into closed_periods(id, period, start_date, end_date, closed_at, employees)
  values ((extract(epoch from now())*1000)::bigint, p_period, p_start::text, p_end::text, now()::text, p_snapshot);
  update employees set absent_days=0, loan=0, loan_note='', broker_fee=0, other_deduction=0, other_note='';
end;
$$;

revoke all on function public.close_pay_period(text,date,date,jsonb) from public, anon;
grant execute on function public.close_pay_period(text,date,date,jsonb) to authenticated;
