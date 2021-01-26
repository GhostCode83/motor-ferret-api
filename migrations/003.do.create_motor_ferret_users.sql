CREATE TABLE motor_ferret_users (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  username TEXT NOT NULL UNIQUE,
  fullname TEXT NOT NULL,
  password TEXT NOT NULL,
  start_date DATE DEFAULT now() NOT NULL,
  date_modified TIMESTAMPTZ,
  flagged INTEGER DEFAULT 0,
  -- 0=FALSE / 1=TRUE
  profile_picture TEXT
);

ALTER TABLE motor_ferret_events
  ADD COLUMN
    author_id INTEGER REFERENCES motor_ferret_users(id)
    ON DELETE SET NULL;
