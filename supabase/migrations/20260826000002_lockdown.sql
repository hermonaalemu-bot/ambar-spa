-- Phase 2: the actual lockdown. Drops the "Allow all" policies that let anyone on the
-- internet read and write every table using only the public anon key, and replaces
-- them with real role checks based on a genuine Supabase Auth session.
--
-- DO NOT RUN THIS until the new App.jsx (real Supabase Auth login) is built, deployed,
-- and confirmed working end-to-end against this same database. The old client code
-- (plaintext password compare, no real session) will lose all access the moment this
-- runs — that is the point, but it means the new client must already be live first.

-- ── categories ──────────────────────────────────────────────
drop policy if exists "Allow all" on categories;
create policy "staff read categories" on categories for select to authenticated using (is_active_staff());
create policy "manager write categories" on categories for all to authenticated
  using (current_staff_role() = 'manager') with check (current_staff_role() = 'manager');

-- ── services ────────────────────────────────────────────────
drop policy if exists "Allow all" on services;
create policy "staff read services" on services for select to authenticated using (is_active_staff());
create policy "manager write services" on services for all to authenticated
  using (current_staff_role() = 'manager') with check (current_staff_role() = 'manager');

-- ── expenses (manager-only end to end) ─────────────────────
drop policy if exists "Allow all" on expenses;
create policy "manager only expenses" on expenses for all to authenticated
  using (current_staff_role() = 'manager') with check (current_staff_role() = 'manager');

-- ── closed_periods (manager-only; also written by close_pay_period()) ─
drop policy if exists "Allow all" on closed_periods;
create policy "manager read closed_periods" on closed_periods for select to authenticated using (current_staff_role() = 'manager');
create policy "manager insert closed_periods" on closed_periods for insert to authenticated with check (current_staff_role() = 'manager');

-- ── employees (any staff can read for assignment; only manager edits payroll) ─
drop policy if exists "Allow all" on employees;
create policy "staff read employees" on employees for select to authenticated using (is_active_staff());
create policy "manager write employees" on employees for all to authenticated
  using (current_staff_role() = 'manager') with check (current_staff_role() = 'manager');

-- ── visits (reception/supervisor/checkout all touch these) ─
drop policy if exists "Allow all" on visits;
create policy "staff manage visits" on visits for all to authenticated
  using (is_active_staff()) with check (is_active_staff());

-- ── bookings ────────────────────────────────────────────────
drop policy if exists "Allow all for bookings" on bookings;
create policy "staff manage bookings" on bookings for all to authenticated
  using (is_active_staff()) with check (is_active_staff());
-- (anon access to bookings now goes only through the public_today_bookings view)

-- ── customers (reception registers/searches; manager browses the full list) ─
drop policy if exists "Allow all" on customers;
create policy "staff manage customers" on customers for all to authenticated
  using (is_active_staff()) with check (is_active_staff());

-- ── settings (queue toggles, inventory, design — nothing secret) ─
drop policy if exists "Allow all for settings" on settings;
drop policy if exists "Allow all" on settings;
create policy "staff manage settings" on settings for all to authenticated
  using (is_active_staff()) with check (is_active_staff());

-- ── activity_log (any staff can write; only manager can read the audit trail;
--    anon may still record a failed-login attempt before a session exists) ─
drop policy if exists "Allow all for activity_log" on activity_log;
create policy "staff insert activity_log" on activity_log for insert to authenticated with check (is_active_staff());
create policy "anon insert failed login" on activity_log for insert to anon with check (action = 'Failed Login');
create policy "manager read activity_log" on activity_log for select to authenticated using (current_staff_role() = 'manager');

-- ── service_time_log ────────────────────────────────────────
drop policy if exists "Allow all for service_time_log" on service_time_log;
create policy "staff manage service_time_log" on service_time_log for all to authenticated
  using (is_active_staff()) with check (is_active_staff());

-- ── staff (identity table itself — the tightest of all) ────
drop policy if exists "Allow all for staff" on staff;
create policy "read own staff row" on staff for select to authenticated using (user_id = auth.uid());
create policy "manager reads all staff" on staff for select to authenticated using (current_staff_role() = 'manager');
create policy "manager updates staff" on staff for update to authenticated
  using (current_staff_role() = 'manager') with check (current_staff_role() = 'manager');
-- No insert/delete policy for staff at all: creating or removing an account only ever
-- happens through the staff-admin Edge Function, which uses the service_role key and
-- therefore bypasses RLS entirely by design — never through a direct client write.

-- ── backup_log (system-internal; service_role writes bypass RLS already) ─
drop policy if exists "Allow all for backup_log" on backup_log;
create policy "manager reads backup_log" on backup_log for select to authenticated using (current_staff_role() = 'manager');
