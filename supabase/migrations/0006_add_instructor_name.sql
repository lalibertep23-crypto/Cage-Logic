-- ============================================================================
-- 0006 — Add instructor_name to training_sessions
-- Free text: who taught the class.
-- ============================================================================

alter table public.training_sessions
  add column if not exists instructor_name text;
