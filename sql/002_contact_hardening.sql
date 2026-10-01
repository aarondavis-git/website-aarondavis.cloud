-- Length limits, request metadata for rate limiting, and a status column for
-- triage. Written to be safe to run more than once: Docker's initdb runs every
-- sql/ file on a fresh volume without recording it in schema_migrations, so a
-- later `npm run db:migrate` may apply this again.

ALTER TABLE contact_submissions
  ADD COLUMN IF NOT EXISTS ip_hash    TEXT,
  ADD COLUMN IF NOT EXISTS user_agent TEXT,
  ADD COLUMN IF NOT EXISTS status     TEXT NOT NULL DEFAULT 'new';

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contact_submissions_name_len') THEN
    ALTER TABLE contact_submissions
      ADD CONSTRAINT contact_submissions_name_len    CHECK (char_length(name)    BETWEEN 1 AND 200),
      ADD CONSTRAINT contact_submissions_email_len   CHECK (char_length(email)   BETWEEN 3 AND 320),
      ADD CONSTRAINT contact_submissions_message_len CHECK (char_length(message) BETWEEN 1 AND 5000),
      ADD CONSTRAINT contact_submissions_status_chk  CHECK (status IN ('new', 'read', 'replied', 'spam'));
  END IF;
END
$$;

-- Rate-limit lookup: "how many from this client in the last hour?"
CREATE INDEX IF NOT EXISTS contact_submissions_ip_hash_created_at_idx
  ON contact_submissions (ip_hash, created_at DESC);
