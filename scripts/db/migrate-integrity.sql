-- INFINITUS Database Integrity & Dedup Migration
-- Run this in the Supabase SQL editor if upgrading an existing database.

-- 1. Deduplicate members keeping newest row
delete from members a using (
  select min(ctid) as ctid, name
  from members
  group by name having count(*) > 1
) b
where a.name = b.name
and a.ctid <> b.ctid;

-- 2. Deduplicate events keeping newest row
delete from events a using (
  select min(ctid) as ctid, title, event_date
  from events
  group by title, event_date having count(*) > 1
) b
where a.title = b.title and a.event_date = b.event_date
and a.ctid <> b.ctid;

-- 3. Add unique index on members(name)
create unique index if not exists idx_members_name on members (name);

-- 4. Add unique index on events(title, event_date)
create unique index if not exists idx_events_title_date on events (title, event_date);

-- 5. Add check constraint on events.status if not already present
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'events_status_check'
  ) then
    alter table events add constraint events_status_check check (status in ('upcoming', 'conducted'));
  end if;
end $$;
