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
    address,
    address2,
    city,
    state,
    zip
    )
VALUES
('Footy National Cup',
 '9/1/2021',
 '9/2/2021',
 'RaceWays',
 'https://ghostcode83.github.io/Portfolio-Webpage/',
 'road_racing',
 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nisl eros, pulvinar facilisis justo mollis, auctor consequat urna. Morbi a bibendum metus.',
  '7520 Queen Lane',
  '',
  'Reynoldsburg',
  'OH',
  '43068'
  ),
  ('Pique Gymkhana Tournament'
  ,
 '10/28/2021',
 '10/28/2021',
 'Pique Racing',
 'https://ghostcode83.github.io/Portfolio-Webpage/',
 'time_attack',
 'Saw he Greater his gathering land called fruit divided tree land living open signs creepeth firmament lesser. Seasons isn''t also. The land god great our tree. A give had lights seed seas them in day evening. Very saw moved grass fruit fill God seed give lights days. Us, very, don''t.',
  '71 Glen Eagles Ave.',
  '',
  'Maumee',
  'OH',
  '43537'
  ),
  ('Heed Drag Racing Championship',
 '3/31/2022',
 '3/31/2022',
 'Heed Hot Rod Association',
 'https://ghostcode83.github.io/Portfolio-Webpage/',
 'drag_racing',
 'So lights. The Saying face fill seas years it, moveth stars 
      Good. Meat subdue them seed. Can''t place green. For very under Abundantly of 
      moveth thing day was good light. Creeping, heaven unto, don''t. Creeping let i 
      it which can''t called multiply For gathered place fruitful image fish sea meat.',
  '7085 Marvon Drive',
  '',
  'Lake Worth',
  'FL',
  '33460'
  ),
  ('Forest Ohio Rally Cup',
 '4/25/2022',
 '4/27/2022',
 'Forest Ohio Rally Group',
 'https://ghostcode83.github.io/Portfolio-Webpage/',
 'rallying',
 'Fly',
  '157 Manor St.',
  '',
  'Pittsburgh',
  'PA',
  '15206'
  );

INSERT INTO motor_ferret_users (
  fullname,
  username,
  password,
  profile_picture,
  flagged,
  admin, 
  blocked
    )
VALUES
( 'Alvin Alphonse',
'AlphonseAdvisor',
'$2a$04$PSXXQcbJm7sOIgbt74GuFu6I0ZLDqeW50LESaMa/zZT1I.wFCz0rm',
'[placeholder for user image]',
'No',
'No',
'No'
), 
( 'Oprah Bailey',
'BaileyBoxer',
'$2a$04$PSXXQcbJm7sOIgbt74GuFu6I0ZLDqeW50LESaMa/zZT1I.wFCz0rm',
'[placeholder for user image]',
'No',
'No',
'No'
), 
( 'Jeremy Jeremy',
'CalypsoClover',
'$2a$04$PSXXQcbJm7sOIgbt74GuFu6I0ZLDqeW50LESaMa/zZT1I.wFCz0rm',
'[placeholder for user image]',
'Yes',
'No',
'Yes'
),
( 'Randy Douglas',
'Admin10',
'$2a$04$PSXXQcbJm7sOIgbt74GuFu6I0ZLDqeW50LESaMa/zZT1I.wFCz0rm',
'[placeholder for user image]',
'No',
'Yes',
'No'
);