
CREATE TYPE event_dropdown AS ENUM (
  'rallying',
  'time_attack',
  'drag_racing',
  'road_racing'
);

ALTER TABLE motor_ferret_events
  ADD COLUMN
    event_type event_dropdown;

