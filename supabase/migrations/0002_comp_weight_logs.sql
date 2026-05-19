-- Migration: comp_weight_logs
-- Daily weight tracking per competition period.
-- Archived implicitly by comp_id foreign key when comp is past.

create table if not exists comp_weight_logs (
  id            uuid primary key default gen_random_uuid(),
  athlete_id    uuid not null references auth.users(id) on delete cascade,
  comp_id       uuid not null references competitions(id) on delete cascade,
  logged_date   date not null default current_date,
  weight_lbs    numeric(5, 1) not null,
  notes         text,
  created_at    timestamptz not null default now(),

  -- One entry per athlete per comp per day
  unique (athlete_id, comp_id, logged_date)
);

-- Index for fetching history by comp
create index if not exists comp_weight_logs_comp_idx
  on comp_weight_logs (athlete_id, comp_id, logged_date desc);

-- RLS
alter table comp_weight_logs enable row level security;

create policy "athlete_own_weight_logs"
  on comp_weight_logs
  for all
  using (athlete_id = auth.uid())
  with check (athlete_id = auth.uid());
