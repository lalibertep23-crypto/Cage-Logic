-- Migration 0013: Data licensing consent architecture
-- Adds athlete opt-in consent and anonymization eligibility flags to athletes table.
-- Required from V1 to support future research licensing, insurance actuarial product,
-- and institutional data partnerships (NFLPA/WHOOP model).
-- All fields additive, non-breaking. Safe to run against existing data.

-- 1. Athlete opt-in: explicit consent to share anonymized training data for research.
--    Set during onboarding (done screen). Default false = no consent until explicitly given.
--    Athlete can opt out at any time via Settings. Honors opt-out immediately.
alter table public.athletes
  add column if not exists data_licensing_consent bool not null default false;

comment on column public.athletes.data_licensing_consent is
  'Athlete explicitly opted in to share anonymized training data for research/licensing purposes. Set during onboarding. Can be revoked in Settings at any time.';

-- 2. Anonymization eligibility: whether this athlete''s data is eligible for export.
--    Defaults true. Set to false if athlete requests data exclusion, if a legal hold
--    applies, or if sensitive flags are present that prevent safe anonymization.
--    The nightly C-WAR batch only includes rows where BOTH fields are true.
alter table public.athletes
  add column if not exists data_anonymization_eligible bool not null default true;

comment on column public.athletes.data_anonymization_eligible is
  'Whether this athlete''s data can be included in anonymized export batches. Default true. Set false on legal hold, exclusion request, or sensitive data flags.';

-- 3. Audit timestamp: when consent was last changed.
--    Required for compliance trail. Null = consent not yet explicitly set (pre-migration athletes).
alter table public.athletes
  add column if not exists data_consent_updated_at timestamptz;

comment on column public.athletes.data_consent_updated_at is
  'Timestamp of last explicit consent change. Null for athletes who have not yet completed onboarding consent step.';

-- Index for nightly batch query: only pull consented + eligible athletes.
create index if not exists idx_athletes_data_export_eligible
  on public.athletes (data_licensing_consent, data_anonymization_eligible)
  where data_licensing_consent = true and data_anonymization_eligible = true;
