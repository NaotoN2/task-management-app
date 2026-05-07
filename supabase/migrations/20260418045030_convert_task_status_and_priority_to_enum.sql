CREATE TYPE task_status AS ENUM('todo','in_progress','done');
CREATE TYPE task_priority AS ENUM('low','medium','high');

ALTER TABLE task
  DROP CONSTRAINT task_status_check,
  DROP CONSTRAINT task_priority_check,
  ALTER COLUMN status DROP DEFAULT,
  ALTER COLUMN priority DROP DEFAULT,
  ALTER COLUMN status TYPE task_status USING status::task_status,
  ALTER COLUMN priority TYPE task_priority USING priority::task_priority,
  ALTER COLUMN status SET DEFAULT 'todo',
  ALTER COLUMN priority SET DEFAULT 'medium';
