-- Add lifting profile fields to athletes table for Health tab load philosophy.
ALTER TABLE public.athletes
  ADD COLUMN IF NOT EXISTS weekly_lifting_days int CHECK (weekly_lifting_days BETWEEN 0 AND 7),
  ADD COLUMN IF NOT EXISTS lifting_intensity text CHECK (lifting_intensity IN ('heavy', 'moderate', 'light', 'none'));
