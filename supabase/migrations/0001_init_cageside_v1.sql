-- ============================================================================
-- CAGESIDE V1 — INITIAL SCHEMA
-- Source of truth: docs/cageside-v1-cowork-starter.md
-- All tables: RLS enabled. Sensitive fields flagged for app-layer encryption.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- IDENTITY & ROLES
-- ----------------------------------------------------------------------------

create table public.gyms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text,
  state text,
  country text default 'US',
  founder_pricing boolean default false,
  created_at timestamptz not null default now()
);

create table public.athletes (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  photo_url text,
  gym_id uuid references public.gyms(id),
  sex text check (sex in ('male','female','other','prefer_not')),
  date_of_birth date,
  height_cm numeric,
  current_weight_kg numeric,
  walking_weight_kg numeric,
  dominant_side text check (dominant_side in ('left','right','ambi')),
  day_job_category text,
  day_job_hours_physical_per_day numeric,
  start_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create type role_kind as enum ('athlete','class_coach','head_instructor','gym_owner');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  gym_id uuid references public.gyms(id) on delete cascade,
  role role_kind not null,
  created_at timestamptz not null default now(),
  unique (user_id, gym_id, role)
);

create table public.athlete_disciplines (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid not null references public.athletes(id) on delete cascade,
  discipline text not null,         -- bjj, mma, boxing, muay_thai, wrestling
  rank text,                        -- e.g. "white belt 2 stripes"
  rank_color text,
  stripes int default 0,
  start_date date,
  is_primary boolean default false,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- GOALS & HEALTH BASELINE
-- ----------------------------------------------------------------------------

create table public.athlete_goals (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid not null references public.athletes(id) on delete cascade,
  why_training text,
  comp_status text,                 -- never, occasional, regular, pro
  belt_goal text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- SENSITIVE: encrypt at application layer before insert
create table public.athlete_health_baseline (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid not null references public.athletes(id) on delete cascade,
  past_injuries_encrypted text,
  current_injuries_encrypted text,
  conditions_encrypted text,
  pt_status text,
  consent_given boolean not null default false,
  consent_given_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- TRAINING DATA
-- ----------------------------------------------------------------------------

create table public.technique_tags (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  label text not null,
  discipline text,                  -- bjj, standup, mma, etc.
  category text,                    -- guard, pass, sweep, submission, escape, takedown
  position text,                    -- closed_guard, side_control, mount, back...
  is_custom boolean default false,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table public.training_sessions (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid not null references public.athletes(id) on delete cascade,
  gym_id uuid references public.gyms(id),
  session_date date not null,
  start_time time,
  duration_minutes int,
  session_type text,                -- gi, no_gi, drilling, open_mat, comp_class
  energy_1_10 int check (energy_1_10 between 1 and 10),
  intensity_1_10 int check (intensity_1_10 between 1 and 10),
  notes text,
  created_at timestamptz not null default now()
);

create table public.session_techniques (
  session_id uuid not null references public.training_sessions(id) on delete cascade,
  technique_id uuid not null references public.technique_tags(id) on delete restrict,
  primary key (session_id, technique_id)
);

create table public.session_reflections (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.training_sessions(id) on delete cascade,
  athlete_id uuid not null references public.athletes(id) on delete cascade,
  what_clicked text,
  what_didnt text,
  question_for_coach text,
  follow_up_notes text,             -- added on return-visits (rewarded behavior)
  word_count int generated always as (
    coalesce(array_length(regexp_split_to_array(coalesce(what_clicked,'') || ' ' || coalesce(what_didnt,'') || ' ' || coalesce(question_for_coach,''), '\s+'), 1), 0)
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.roll_logs (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.training_sessions(id) on delete cascade,
  athlete_id uuid not null references public.athletes(id) on delete cascade,
  round_number int,
  partner_label text,               -- "blue belt, 80kg" (no PII required)
  partner_relative_size text,       -- smaller, same, bigger
  outcome text check (outcome in ('tapped_them','got_tapped','draw','positional')),
  outcome_method text,              -- choke, joint_lock, position, time
  felt text,                        -- "lost guard fast", "swept twice"
  created_at timestamptz not null default now()
);

create table public.roll_techniques (
  roll_id uuid not null references public.roll_logs(id) on delete cascade,
  technique_id uuid not null references public.technique_tags(id) on delete restrict,
  used_or_attempted text check (used_or_attempted in ('used','attempted','defended_against')),
  primary key (roll_id, technique_id, used_or_attempted)
);

-- ----------------------------------------------------------------------------
-- PROGRESSION & COMPETITION
-- ----------------------------------------------------------------------------

create table public.promotion_criteria (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid references public.gyms(id),
  discipline text not null,
  from_rank text not null,
  to_rank text not null,
  criteria_json jsonb not null,     -- {min_classes:24, must_show:[...], notes:""}
  is_default boolean default false,
  created_at timestamptz not null default now()
);

create table public.progression_events (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid not null references public.athletes(id) on delete cascade,
  gym_id uuid references public.gyms(id),
  discipline text not null,
  event_type text check (event_type in ('stripe','belt','rank_other')),
  to_rank text not null,
  awarded_by uuid references auth.users(id),
  awarded_at timestamptz not null default now(),
  notes text,
  created_at timestamptz not null default now()
);

create table public.competitions (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid not null references public.athletes(id) on delete cascade,
  name text not null,
  organization text,                -- IBJJF, ADCC, NAGA, local...
  comp_date date not null,
  weight_class text,
  rule_set text,                    -- gi, no_gi, submission_only
  taper_start_date date,
  outcome_summary text,
  created_at timestamptz not null default now()
);

create table public.competition_matches (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references public.competitions(id) on delete cascade,
  athlete_id uuid not null references public.athletes(id) on delete cascade,
  round_label text,                 -- "R1", "Semi", "Final"
  opponent_label text,
  result text check (result in ('win','loss','draw','dq','no_contest')),
  method text,                      -- submission, points, decision, dq
  duration_seconds int,
  notes text,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- HEALTH, RECOVERY, INJURY
-- ----------------------------------------------------------------------------

create table public.injury_reports (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid not null references public.athletes(id) on delete cascade,
  body_region text not null,
  side text check (side in ('left','right','bilateral','axial','na')),
  mechanism text,
  pain_at_report_0_10 int check (pain_at_report_0_10 between 0 and 10),
  occurred_on date not null,
  reported_at timestamptz not null default now(),
  stage text default 'acute' check (stage in ('acute','sub_acute','modified_training','return_to_drill','return_to_roll','resolved')),
  i_prrs_score numeric,             -- gate to return-to-roll
  resolved_on date,
  notes_encrypted text               -- SENSITIVE: app-layer AES-256-GCM before insert
);

create table public.injury_progress_logs (
  id uuid primary key default gen_random_uuid(),
  injury_id uuid not null references public.injury_reports(id) on delete cascade,
  athlete_id uuid not null references public.athletes(id) on delete cascade,
  log_date date not null default current_date,
  pain_0_10 int check (pain_0_10 between 0 and 10),
  function_0_10 int check (function_0_10 between 0 and 10),
  did_modified_training boolean default false,
  notes_encrypted text,              -- SENSITIVE: app-layer AES-256-GCM before insert
  created_at timestamptz not null default now()
);

create table public.daily_soreness_logs (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid not null references public.athletes(id) on delete cascade,
  log_date date not null default current_date,
  overall_soreness_0_10 int check (overall_soreness_0_10 between 0 and 10),
  body_regions text[],              -- ['neck','low_back']
  created_at timestamptz not null default now(),
  unique (athlete_id, log_date)
);

create table public.weight_logs (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid not null references public.athletes(id) on delete cascade,
  log_date date not null default current_date,
  weight_kg numeric not null,
  energy_0_10 int check (energy_0_10 between 0 and 10),
  hunger_0_10 int check (hunger_0_10 between 0 and 10),
  notes text,
  unique (athlete_id, log_date)
);

create table public.hydration_logs (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid not null references public.athletes(id) on delete cascade,
  log_date date not null default current_date,
  fluid_ml int not null,
  unique (athlete_id, log_date)
);

create table public.wearable_data (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid not null references public.athletes(id) on delete cascade,
  source text check (source in ('manual','whoop','oura','apple_health','google_fit')) default 'manual',
  log_date date not null default current_date,
  recovery_score int,
  hrv_ms numeric,
  resting_hr int,
  sleep_minutes int,
  strain_score numeric,
  unique (athlete_id, source, log_date)
);

-- ----------------------------------------------------------------------------
-- MENTAL & PSYCH (SENSITIVE)
-- ----------------------------------------------------------------------------

create table public.psych_assessments (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid not null references public.athletes(id) on delete cascade,
  instrument text not null check (instrument in ('BRS','MTQ-10','I-PRRS','GRIT-S','daily_prompt')),
  raw_responses_encrypted text,
  score numeric,
  subscale_json jsonb,
  taken_at timestamptz not null default now()
);

create table public.loss_events (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid not null references public.athletes(id) on delete cascade,
  competition_match_id uuid references public.competition_matches(id),
  roll_log_id uuid references public.roll_logs(id),
  context text check (context in ('competition','rolling','other')),
  severity text check (severity in ('tough','rough','crushing')),
  occurred_at timestamptz not null default now()
);

create table public.loss_phase_1_responses (
  id uuid primary key default gen_random_uuid(),
  loss_event_id uuid not null references public.loss_events(id) on delete cascade,
  athlete_id uuid not null references public.athletes(id) on delete cascade,
  raw_responses_encrypted text,
  rebound_index numeric,
  taken_at timestamptz not null default now()
);

create table public.loss_phase_2_reflections (
  id uuid primary key default gen_random_uuid(),
  loss_event_id uuid not null references public.loss_events(id) on delete cascade,
  athlete_id uuid not null references public.athletes(id) on delete cascade,
  raw_responses_encrypted text,
  one_thing_to_drill text,
  taken_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- COMPUTED / CACHED
-- ----------------------------------------------------------------------------

create table public.daily_metrics (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid not null references public.athletes(id) on delete cascade,
  metric_date date not null,
  investment_score numeric,         -- null while ramping
  consistency_pct numeric,
  reflection_pct numeric,
  mental_pct numeric,
  recovery_pct numeric,
  self_study_pct numeric,
  is_ramping boolean default true,
  days_of_data int default 0,
  computed_at timestamptz not null default now(),
  unique (athlete_id, metric_date)
);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

alter table public.gyms enable row level security;
alter table public.athletes enable row level security;
alter table public.user_roles enable row level security;
alter table public.athlete_disciplines enable row level security;
alter table public.athlete_goals enable row level security;
alter table public.athlete_health_baseline enable row level security;
alter table public.technique_tags enable row level security;
alter table public.training_sessions enable row level security;
alter table public.session_techniques enable row level security;
alter table public.session_reflections enable row level security;
alter table public.roll_logs enable row level security;
alter table public.roll_techniques enable row level security;
alter table public.promotion_criteria enable row level security;
alter table public.progression_events enable row level security;
alter table public.competitions enable row level security;
alter table public.competition_matches enable row level security;
alter table public.injury_reports enable row level security;
alter table public.injury_progress_logs enable row level security;
alter table public.daily_soreness_logs enable row level security;
alter table public.weight_logs enable row level security;
alter table public.hydration_logs enable row level security;
alter table public.wearable_data enable row level security;
alter table public.psych_assessments enable row level security;
alter table public.loss_events enable row level security;
alter table public.loss_phase_1_responses enable row level security;
alter table public.loss_phase_2_reflections enable row level security;
alter table public.daily_metrics enable row level security;

-- V1 = single user (Chris). Athlete-owned rows: athlete_id = auth.uid().
-- These policies are the V1 baseline. V1.5 adds coach/owner read paths via user_roles.

create policy "athletes_self_read"   on public.athletes for select using (id = auth.uid());
create policy "athletes_self_write"  on public.athletes for update using (id = auth.uid()) with check (id = auth.uid());
create policy "athletes_self_insert" on public.athletes for insert with check (id = auth.uid());

-- Helper: a single policy template applied per athlete-owned table.
do $$
declare
  t text;
  athlete_tables text[] := array[
    'athlete_disciplines','athlete_goals','athlete_health_baseline',
    'training_sessions','session_reflections','roll_logs',
    'progression_events','competitions','competition_matches',
    'injury_reports','injury_progress_logs','daily_soreness_logs',
    'weight_logs','hydration_logs','wearable_data',
    'psych_assessments','loss_events','loss_phase_1_responses','loss_phase_2_reflections',
    'daily_metrics'
  ];
begin
  foreach t in array athlete_tables loop
    execute format($f$
      create policy "%1$s_self_read"   on public.%1$I for select using (athlete_id = auth.uid());
      create policy "%1$s_self_write"  on public.%1$I for update using (athlete_id = auth.uid()) with check (athlete_id = auth.uid());
      create policy "%1$s_self_insert" on public.%1$I for insert with check (athlete_id = auth.uid());
      create policy "%1$s_self_delete" on public.%1$I for delete using (athlete_id = auth.uid());
    $f$, t);
  end loop;
end$$;

-- Join tables: ownership via parent.
create policy "session_techniques_owner" on public.session_techniques
  for all using (
    exists (select 1 from public.training_sessions s where s.id = session_id and s.athlete_id = auth.uid())
  ) with check (
    exists (select 1 from public.training_sessions s where s.id = session_id and s.athlete_id = auth.uid())
  );

create policy "roll_techniques_owner" on public.roll_techniques
  for all using (
    exists (select 1 from public.roll_logs r where r.id = roll_id and r.athlete_id = auth.uid())
  ) with check (
    exists (select 1 from public.roll_logs r where r.id = roll_id and r.athlete_id = auth.uid())
  );

-- Public/read-mostly tables.
create policy "gyms_read_all"           on public.gyms              for select using (true);
create policy "technique_tags_read_all" on public.technique_tags    for select using (true);
create policy "technique_tags_create"   on public.technique_tags    for insert with check (auth.uid() = created_by);
create policy "promotion_criteria_read" on public.promotion_criteria for select using (true);

-- user_roles: user reads own roles.
create policy "user_roles_self_read"  on public.user_roles for select using (user_id = auth.uid());

-- ============================================================================
-- INDEXES
-- ============================================================================

create index on public.training_sessions   (athlete_id, session_date desc);
create index on public.session_reflections (athlete_id, created_at desc);
create index on public.roll_logs           (athlete_id, created_at desc);
create index on public.daily_soreness_logs (athlete_id, log_date desc);
create index on public.daily_metrics       (athlete_id, metric_date desc);
create index on public.psych_assessments   (athlete_id, taken_at desc);
create index on public.injury_reports      (athlete_id, stage);
create index on public.progression_events  (athlete_id, awarded_at desc);
create index on public.competitions        (athlete_id, comp_date desc);
