-- Migration: comp prep detail columns + post-comp reflections table

-- ─── competitions: add prep detail columns ────────────────────────────────────
alter table competitions
  add column if not exists weigh_in_time     time,
  add column if not exists first_match_time  time,
  add column if not exists target_weight_lbs numeric(5, 1),
  add column if not exists weigh_in_type     text
    check (weigh_in_type in ('same_day', 'day_before'));

-- ─── comp_post_reflections ────────────────────────────────────────────────────
create table if not exists comp_post_reflections (
  id                       uuid primary key default gen_random_uuid(),
  athlete_id               uuid not null references auth.users(id) on delete cascade,
  comp_id                  uuid not null references competitions(id) on delete cascade,

  -- Encrypted free-text (AES-256-GCM, written server-side only)
  what_worked_encrypted    text,
  what_worked_word_count   int,
  what_broke_encrypted     text,
  what_broke_word_count    int,
  what_surprised_encrypted text,
  what_surprised_word_count int,

  -- Plaintext coaching cues — meant to resurface in training prompts
  drill_priority_1         text,
  drill_priority_2         text,

  -- Plaintext metrics — safe for Investment Score + C-WAR later
  injury_flag              boolean not null default false,
  fatigue_level            text check (fatigue_level in ('low', 'medium', 'high')),
  mental_state_pre         text check (mental_state_pre in ('low', 'medium', 'high')),
  mental_state_during      text check (mental_state_during in ('low', 'medium', 'high')),
  next_comp_planned        boolean,

  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now(),

  unique (athlete_id, comp_id)  -- one reflection per comp
);

alter table comp_post_reflections enable row level security;

create policy "athlete_own_post_reflections"
  on comp_post_reflections
  for all
  using  (athlete_id = auth.uid())
  with check (athlete_id = auth.uid());

-- updated_at trigger
create or replace function update_comp_post_reflections_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_comp_post_reflections_updated_at
  before update on comp_post_reflections
  for each row execute function update_comp_post_reflections_updated_at();
