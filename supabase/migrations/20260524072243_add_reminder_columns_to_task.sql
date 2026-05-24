ALTER TABLE task
 ADD COLUMN remind_at timestamptz,
 ADD COLUMN reminded_at timestamptz;