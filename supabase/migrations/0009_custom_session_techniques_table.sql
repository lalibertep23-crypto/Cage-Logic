-- Separate join table for custom (unreviewed) techniques on a session.
-- Avoids touching the PK of session_techniques.
CREATE TABLE custom_session_techniques (
  session_id           uuid NOT NULL REFERENCES training_sessions(id) ON DELETE CASCADE,
  custom_submission_id uuid NOT NULL REFERENCES custom_technique_submissions(id) ON DELETE CASCADE,
  PRIMARY KEY (session_id, custom_submission_id)
);

ALTER TABLE custom_session_techniques ENABLE ROW LEVEL SECURITY;

CREATE POLICY "athletes_own_custom_session_techniques"
  ON custom_session_techniques
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM training_sessions ts
      WHERE ts.id = session_id AND ts.athlete_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM training_sessions ts
      WHERE ts.id = session_id AND ts.athlete_id = auth.uid()
    )
  );
