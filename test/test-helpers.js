const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
    {
      id: 1,
      fullname: 'Test-user-1',
      password: 'password',
      username: 'test-user-1',
      start_date: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 2,
      fullname: 'Test-user-2',
      password: 'password',
      username: 'test-user-2',
      start_date: '2029-01-22T16:28:32.615Z',
      blocked: "Yes"
    },
    {
      id: 3,
      fullname: 'Test-user-3',
      password: 'password',
      username: 'test-user-3',
      start_date: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 4,
      fullname: 'Test-user-4',
      password: 'password',
      username: 'test-user-4',
      start_date: '2029-01-22T16:28:32.615Z',
    },
  ]
}

function makeEventsArray() {
  return [
    {
      id: 1,
      title: 'Track Event',
      date1: '2021-02-18T05:00:00.000Z',
      date2: '2021-02-18T05:00:00.000Z',
      date_created: '2020-02-18T05:00:00.000Z',
      organizer: 'Me',
      website: 'www.help-me.com',
      address: '123 Street Street',
      address2: '',
      event_description: 'this is a test description',
      event_type: 'rallying',
      city: 'Largo',
      state: 'MD',
      zip: '20774',
    },
    {
      id: 2,
      title: 'Track Event',
      date1: '2021-02-18T05:00:00.000Z',
      date2: '2021-02-18T05:00:00.000Z',
      date_created: '2020-02-18T05:00:00.000Z',
      event_description: 'this is a test description',
      event_type: 'rallying',
      organizer: 'Me',
      website: 'www.help-me.com',
      address: '123 Street Street',
      address2: '',
      city: 'Largo',
      state: 'MD',
      zip: '20774',
    },
    {
      id: 3,
      title: 'Track Event',
      date1: '2021-02-18T05:00:00.000Z',
      date2: '2021-02-18T05:00:00.000Z',
      date_created: '2020-02-18T05:00:00.000Z',
      organizer: 'Me',
      website: 'www.help-me.com',
      address: '123 Street Street',
      address2: '',
      event_description: 'this is a test description',
      event_type: 'rallying',
      city: 'Largo',
      state: 'MD',
      zip: '20774',
    },
    {
      id: 4,
      title: 'Track Event',
      date1: '2021-02-18T05:00:00.000Z',
      date2: '2021-02-18T05:00:00.000Z',
      date_created: '2020-02-18T05:00:00.000Z',
      event_description: 'this is a test description',
      event_type: 'rallying',
      organizer: 'Me',
      website: 'www.help-me.com',
      address: '123 Street Street',
      address2: '',
      city: 'Largo',
      state: 'MD',
      zip: '20774',
    },
  ]
}


function makeExpectedEvent(users, event = []) {

  return {
    id: event.id,
    title: event.title,
    date1: event.date1,
    date2: event.date2,
    organizer: event.organizer,
    website: event.website,
    address: event.address,
    address2: event.address2,
    event_type: event.event_type,
    event_description: event.event_description,
    city: event.city,
    state: event.state,
    zip: event.zip,
  }
}


function makeMaliciousEvent(user) {
  const maliciousEvent = {
    id: 911,
    date_published: new Date().toISOString(),
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    user_id: user.id,
    summary: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
  }
  const expectedEvent = {
    ...makeExpectedEvent([user], maliciousEvent),
    title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    summary: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  }
  return {
    maliciousEvent,
    expectedEvent,
  }
}

function makeEventsFixtures() {
  const testUsers = makeUsersArray()
  const testEvents = makeEventsArray(testUsers)

  return { testUsers, testEvents, }
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE motor_ferret_events, motor_ferret_users RESTART IDENTITY CASCADE;`
  )
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('motor_ferret_users').insert(preppedUsers).returning('*')

}

function seedEventsTables(db, users, events, /*comments = []*/) {
  return db.transaction(async trx => {
    await seedUsers(trx, users)
    await trx.into('motor_ferret_events').insert(events)

  }
  )
}



function seedMaliciousEvents(db, user, event) {
  return seedUsers(db, [user])
    .then(() =>
      db
        .into('motor_ferret_events')
        .insert([event])
    )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.username,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

module.exports = {
  makeUsersArray,
  makeEventsArray,
  makeExpectedEvent,
  makeMaliciousEvent,
  makeEventsFixtures,
  cleanTables,
  seedEventsTables,
  seedMaliciousEvents,
  makeAuthHeader,
  seedUsers,
}

