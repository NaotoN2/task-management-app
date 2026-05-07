ALTER TABLE task
  ADD COLUMN memo text,
  ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();