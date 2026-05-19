-- Custom technique submissions queue
CREATE TABLE custom_technique_submissions (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  athlete_id  uuid NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  name        text NOT NULL,
  position    text,
  status      text NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'linked', 'approved', 'rejected')),
  linked_to   uuid REFERENCES technique_tags(id) ON DELETE SET NULL,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE custom_technique_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "athletes_own_submissions"
  ON custom_technique_submissions
  FOR ALL
  USING (athlete_id = auth.uid())
  WITH CHECK (athlete_id = auth.uid());
