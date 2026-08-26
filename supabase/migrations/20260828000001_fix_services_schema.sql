-- The services table was missing these two columns entirely, which is why the
-- app's default-catalog seed insert has been silently failing since day one —
-- it tried to write bookable/duration_mins values into columns that don't exist.
alter table services add column if not exists bookable boolean default false;
alter table services add column if not exists duration_mins integer default 60;
