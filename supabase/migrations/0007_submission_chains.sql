-- Groups a submission chain to a roll
CREATE TABLE submission_chains (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  roll_id     uuid NOT NULL REFERENCES roll_logs(id) ON DELETE CASCADE,
  athlete_id  uuid NOT NULL REFERENCES athletes(id),
  created_at  timestamptz DEFAULT now()
);

-- Each step in the chain
CREATE TABLE submission_chain_entries (
  id                uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  chain_id          uuid NOT NULL REFERENCES submission_chains(id) ON DELETE CASCADE,
  athlete_id        uuid NOT NULL REFERENCES athletes(id),
  sequence_order    integer NOT NULL,
  starting_position text,
  technique_id      uuid REFERENCES technique_tags(id),
  technique_custom  text,
  result            text CHECK (result IN ('finished','defended','escaped','transitioned')),
  created_at        timestamptz DEFAULT now()
);
