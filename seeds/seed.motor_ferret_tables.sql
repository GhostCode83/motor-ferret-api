BEGIN;

TRUNCATE
  motor_ferret_events
  RESTART IDENTITY CASCADE;
  
  INSERT INTO motor_ferret_events (
    title, 
    date1, 
    date2, 
    organizer, 
    website,
    event_type,
    event_description,
    photo,
    address,
    address2,
    city,
    state,
    zip
    )
VALUES
('Footy National Cup'
,
 '9/1/2021',
 '9/2/2021',
 'RaceWays',
 'raceways.com',
 'road_racing',
 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nisl eros, pulvinar facilisis justo mollis, auctor consequat urna. Morbi a bibendum metus.',
  '[placeholder for event image]',
  '64 Sutor St.',
  '',
  'Davison',
  'MI',
  '48423'
  ),
  ('Pique Gymkhana Tournament'
  ,
 '10/28/2021',
 '10/28/2021',
 'Pique Racing',
 'pique-racing.com',
 'time_attack',
 'Saw he Greater his gathering land called fruit divided tree land living open signs creepeth firmament lesser. Seasons isn''t also. The land god great our tree. A give had lights seed seas them in day evening. Very saw moved grass fruit fill God seed give lights days. Us, very, don''t.',
  '[placeholder for event image]',
  '64 Sutor St.',
  '',
  'Davison',
  'MI',
  '48423'
  ),
  ('Heed Drag Racing Championship',
 '3/31/2022',
 '3/31/2022',
 'Heed Hot Rod Association',
 'hhra.com',
 'drag_racing',
 'So lights. The Saying face fill seas years it, moveth stars 
      Good. Meat subdue them seed. Can''t place green. For very under Abundantly of 
      moveth thing day was good light. Creeping, heaven unto, don''t. Creeping let i 
      it which can''t called multiply For gathered place fruitful image fish sea meat.',
  '[placeholder for event image]',
  '64 Sutor St.',
  '',
  'Davison',
  'MI',
  '48423'
  ),
  ('Forest Ohio Rally Cup',
 '4/25/2022',
 '4/27/2022',
 'Forest Ohio Rally Group',
 'o-rally.com',
 'rallying',
 'Fly',
  '[placeholder for event image]',
  '64 Sutor St.',
  '',
  'Davison',
  'MI',
  '48423'
  );
