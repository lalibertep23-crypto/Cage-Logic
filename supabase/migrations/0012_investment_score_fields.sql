-- Migration 0012: Investment Score schema alignment
-- Adds three fields required for Chris's Investment Score spec (V1 core metric).
-- All additive, non-breaking. Safe to run against existing data.

-- 1. Consistency denominator: athlete's declared training frequency from onboarding.
--    Consistency score compares weighted sessions against this target (× 4.3 for 30-day window).
--    Null = not yet captured in onboarding → calculator defaults to 3x/week.
alter table public.athletes
  add column if not exists training_frequency_per_week int
    check (training_frequency_per_week between 1 and 14);

comment on column public.athletes.training_frequency_per_week is
  'Athlete-declared sessions per week (set during onboarding). Used as Consistency domain denominator. NULL = default 3.';

-- 2. Reflection character count: needed for tier scoring (0 / 10 / 60 / 100 pts).
--    Computed from all three reflection fields concatenated.
--    session_reflections already has word_count; this adds char_count alongside it.
alter table public.session_reflections
  add column if not exists char_count int generated always as (
    coalesce(length(trim(
      coalesce(what_clicked, '') || coalesce(what_didnt, '') || coalesce(question_for_coach, '')
    )), 0)
  ) stored;

comment on column public.session_reflections.char_count is
  'Total character count across all three reflection fields. Used for Reflection domain tier scoring.';

-- 3. Daily energy: collocated with soreness for the Recovery state score (50% logging + 50% state).
--    Soreness form UI will be updated separately to collect both fields on the same submit.
--    Until then, energy_0_10 will be null for existing rows — calculator handles null gracefully.
alter table public.daily_soreness_logs
  add column if not exists energy_0_10 int
    check (energy_0_10 between 0 and 10);

comment on column public.daily_soreness_logs.energy_0_10 is
  'Daily energy level 0–10. Collected alongside soreness for Recovery domain state score. NULL until soreness form UI is updated.';
