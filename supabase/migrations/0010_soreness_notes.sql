-- #12: Add optional notes field to daily_soreness_logs
-- Stores cause of soreness (e.g. 'pulled hip flexor drilling singles')
alter table public.daily_soreness_logs
  add column if not exists notes text;
