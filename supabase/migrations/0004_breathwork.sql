-- 0004_breathwork.sql
-- Breathwork session log.
-- Patterns: phase_1 (Performance Pillar Phase 1 — the core protocol).
-- Future: phase_2, phase_2_5_cap, phase_3, phase_4, phase_5, state_grounding, etc.

create table public.breathwork_sessions (
  id           uuid primary key default gen_random_uuid(),
  athlete_id   uuid not null references public.athletes(id) on delete cascade,
  pattern      text not null,
  duration_min int  not null check (duration_min > 0),
  completed_at timestamptz not null default now()
);

alter table public.breathwork_sessions enable row level security;

create policy "breathwork_own_read"
  on public.breathwork_sessions for select
  using (athlete_id = auth.uid());

create policy "breathwork_own_insert"
  on public.breathwork_sessions for insert
  with check (athlete_id = auth.uid());

create index on public.breathwork_sessions (athlete_id, completed_at desc);
