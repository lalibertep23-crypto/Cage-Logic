-- ============================================================================
-- 0005 — Add `side` column to technique_tags
-- Values: 'top' | 'bottom' | 'neutral'
-- Existing rows backfilled based on position + category.
-- ============================================================================

alter table public.technique_tags
  add column if not exists side text check (side in ('top', 'bottom', 'neutral'));

-- ── Backfill existing rows ────────────────────────────────────────────────────

-- Closed guard + open guard = always bottom
update public.technique_tags set side = 'bottom'
  where position in ('closed_guard', 'open_guard');

-- Half guard — bottom (frames, sweeps, submissions from bottom)
update public.technique_tags set side = 'bottom'
  where slug in ('half-guard-frame','underhook-sweep','kimura-from-half');

-- Half guard — top (passing)
update public.technique_tags set side = 'top'
  where slug in ('half-guard-pass-flatten');

-- Side control — top
update public.technique_tags set side = 'top'
  where slug in ('knee-cut-pass','paper-cutter-choke','side-control-hold',
                 'americana-from-side','north-south-choke','mount-from-side');

-- Side control — bottom
update public.technique_tags set side = 'bottom'
  where slug in ('knee-in-escape','ghost-escape','recover-guard-from-side');

-- Mount — top
update public.technique_tags set side = 'top'
  where slug in ('mount-maintenance','armbar-from-mount','americana-from-mount',
                 'ezekiel-choke','cross-collar-choke','s-mount-armbar');

-- Mount — bottom
update public.technique_tags set side = 'bottom'
  where slug in ('upa-bridge-escape','elbow-knee-escape','technical-standup');

-- Back — top (attacking, taking the back)
update public.technique_tags set side = 'top'
  where slug in ('rear-naked-choke','body-triangle-setup','hook-fighting',
                 'chair-sit-back-take','bow-and-arrow-choke');

-- Back — bottom (defending, escaping)
update public.technique_tags set side = 'bottom'
  where slug in ('back-escape-shoulder');

-- Turtle — top (attacking from top of turtle)
update public.technique_tags set side = 'top'
  where slug in ('underhook-back-take');

-- Turtle — bottom (defending, recovering)
update public.technique_tags set side = 'bottom'
  where slug in ('turtle-recovery');

-- Everything else = neutral (standup, drills, leg locks, general)
update public.technique_tags set side = 'neutral'
  where side is null;
