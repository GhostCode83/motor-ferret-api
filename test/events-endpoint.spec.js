const { expect } = require('chai')

const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const AuthService = require('../src/auth/auth-service')
const { makeEventsArray } = require('./events.fixtures')
const { makeAuthHeader } = require('./test-helpers')
const helpers = require('./test-helpers')


describe.only('Events Endpoints', () => {
  let db
  let token

  const {
    testUsers,
    testEvents,
  } = helpers.makeEventsFixtures()


  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })


  before('clean the table', () => helpers.cleanTables(db))

  afterEach('clean the table', () => helpers.cleanTables(db))

  after('disconnect from db', () => db.destroy())

  describe(`GET /api/events`, () => {
    beforeEach('seed database with users and log in the test user', () => {
      return helpers.seedUsers(db, testUsers)
        .then(response => {
          return supertest(app)
            .post('/api/auth/login')
            .send(testUsers[0])
            .expect(response => {
              token = response.body.authToken
            })
        })
    })
    context(`given no events`, () => {

      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/events')
          .set('Authorization', 'bearer ' + token)
          .expect(200)
      })
    })

    context(`Given there are events in the database`, () => {
      const testEvents = makeEventsArray();

      beforeEach('insert events', () => {
        return db
          .into('motor_ferret_events')
          .insert(testEvents)
      })

      it('responds with 200 and all of the events', () => {
        return supertest(app)
          .get('/api/events')
          .set('Authorization', 'bearer ' + token)
          .expect(200)
          .expect(response => {
            expect(response.body).to.be.a('array')
            for (let i = 0; i < response.body.length; i++) {
              expect(response.body[i]).to.include.keys('address', 'city', 'id', 'date1', 'event_description', 'event_type', 'organizer', 'photo', 'state', 'website', 'zip'
              )
            }
          })
      })
    })
  })

  describe(`GET /api/events/:event_id`, () => {
    context(`Given no event`, () => {
      beforeEach(() =>
        helpers.seedUsers(db, testUsers)
      )
      it(`responds with 404`, () => {
        const eventId = 123456
        return supertest(app)
          .get(`/api/events/${eventId}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: { message: `Event doesn't exist` } })
      })
    })

    context('Given there are events in the database', () => {
      beforeEach('insert events', () =>
        helpers.seedEventsTables(
          db,
          testUsers,
          testEvents,
        )
      )

      it('responds with 200 and the specified event', () => {
        const eventId = 2
        const expectedEvent = helpers.makeExpectedEvent(
          testUsers,
          testEvents[eventId - 1],
        )
        return supertest(app)
          .get(`/api/events/${eventId}`)
          .set('Authorization', makeAuthHeader(testUsers[0]))
          .expect(200, expectedEvent)
      })
    })
  })

  describe(`POST /api/events`, () => {
    beforeEach('seed database with users and log in the test user', () => {
      return helpers.seedUsers(db, testUsers)
        .then(response => {
          return supertest(app)
            .post('/api/auth/login')
            .send(testUsers[0])
            .expect(response => {
              token = response.body.authToken
            })
        })
    })
    it(`creates an event, responding with 201 and a new event`, () => {
      const newEvent = {
        "title": "Special Track Event",
        "date1": "2029-01-22T16:28:32.615Z",
        "organizer": "Me",
        "website": "www.help-me.com",
        "address": "123 Street Street",
        "address2": "",
        "city": "Largo",
        "state": "MD",
        "zip": "20774",
        "date_created": "2029-01-22T16:28:32.615Z",
        "event_type": "rallying",
        "event_description": "So lights. The Saying face fill seas years it, moveth stars Good. Meat subdue them seed. Can''t place green. For very under Abundantly of moveth thing day was good light. Creeping, heaven unto, don''t. Creeping let i it which can''t called multiply For gathered place fruitful image fish sea meat.",
        "photo": "placeholder"
      }

      return supertest(app)
        .post('/api/events')
        .set('Authorization', 'bearer ' + token)
        .send(newEvent)
        .expect(201)
        .expect(res => {
          expect(res.body.title).to.eql(newEvent.title)
          // expect(res.body.summary).to.eql(newEvent.summary)
          // expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/api/events/${res.body.id}`)
        })
        .then(res => {
          supertest(app)
            .get(`/api/events/${res.body.id}`)
            .expect(res.body)
        })
    })
  })

  describe(`DELETE /api/events/:event_id`, () => {

    beforeEach(() =>
      helpers.seedUsers(db, testUsers)
    )
    context(`given no events`, () => {
      it(`responds with 404`, () => {
        const eventId = 999999
        return supertest(app)
          .delete(`/api/events/${eventId}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))

          .expect(404)
      })
    })

    context(`given there are events in the table`, () => {
      const testEvents = makeEventsArray()

      beforeEach('insert events', () => {
        return db
          .into('motor_ferret_events')
          .insert(testEvents)
      })

      it(`responds with 204 and deletes the event`, () => {
        const idToRemove = 2;
        const expectedEvents = testEvents.filter(event => event.id !== idToRemove)

        return supertest(app)
          .delete(`/api/events/${idToRemove}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(204)
          .then(res => {
            supertest(app)
              .get(`/api/events`)
              .expect(expectedEvents)
          })
      })
    })
  })

  describe(`PATCH /api/events/:event_id`, () => {
    // beforeEach('what"s in the tables?', () => db.raw(`SELECT * FROM motor_ferret_events;`))

    beforeEach('seed database with users and log in the test user', () => {
      // console.log(db.raw(`SELECT * FROM motor_ferret_events;`))

      // db
      //   .select('*')
      //   .from('motor_ferret_events')
      //   .returning('*')
      //   .then(console.log)


      return helpers.seedUsers(db, testUsers)
        .then(response => {
          return supertest(app)
            .post('/api/auth/login')
            .send(testUsers[0])
            .expect(response => {
              token = response.body.authToken
            })
        })
    })




    context(`Given no events`, () => {
      beforeEach(() => db
        .select('*')
        .from('motor_ferret_events')
        .returning('*')
        .then(console.log)
      )

      it(`responds with 404`, () => {
        const eventId = 123456
        return supertest(app)
          .delete(`/api/events/${eventId}`)
          .set('Authorization', 'bearer ' + token)
          .expect(404, { error: { message: `Event doesn't exist` } })
      })
    })

    context('Given there are events in the database', () => {
      console.log(testUsers, testEvents)
      beforeEach('insert events', () => {
        return db
          .into('motor_ferret_users')
          .insert(testUsers)
          .then(() => {
            return db
              .into('motor_ferret_events')
              .insert(testEvents)
          })
      })

      // beforeEach(() => db
      //   .select('*')
      //   .from('motor_ferret_events')
      //   .returning('*')
      //   .then(console.log)
      // )
      // afterEach(() => db
      //   .select('*')
      //   .from('motor_ferret_events')
      //   .returning('*')
      //   .then(console.log)
      // )

      it('responds with 204 and updates the event', () => {
        beforeEach(() => db
          .select('*')
          .from('motor_ferret_events')
          .returning('*')
          .then(console.log)
        )

        const idToUpdate = 2
        const updateEvent = {
          title: 'Trackity Track Event'
        }
        const expectedEvent = {
          ...testEvents[idToUpdate - 1],
          ...updateEvent
        }
        return supertest(app)
          .patch(`/api/events/${idToUpdate}`)
          .set('Authorization', 'bearer ' + token)
          .send(updateEvent)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/events/${idToUpdate}`)
              .expect(expectedEvent)
          )
      })

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2
        return supertest(app)
          .patch(`/api/events/${idToUpdate}`)
          .set('Authorization', 'bearer ' + token)

          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: `Request body must contain either 'title', 'address' or 'website'`
            }
          })
      })

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2
        const updateEvent = {
          title: 'updated event title',
        }
        const expectedEvent = {
          ...testEvents[idToUpdate - 1],
          ...updateEvent
        }

        return supertest(app)
          .patch(`/api/events/${idToUpdate}`)
          .set('Authorization', 'bearer ' + token)

          .send({
            ...updateEvent,
            fieldToIgnore: 'should not be in GET response'
          })
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/events/${idToUpdate}`)
              .expect(expectedEvent)
          )
      })
    })
  })
})