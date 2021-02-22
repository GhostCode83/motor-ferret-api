const { expect } = require('chai')
const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Users Endpoints', function () {
  let db

  const { testUsers } = helpers.makeEventsFixtures()
  const testUser = testUsers[0]

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`POST /api/users/signup`, () => {
    context(`User Validation`, () => {
      beforeEach('seed database with users and log in the test user', () => {
        return helpers.seedUsers(db, testUsers)

      })

      const requiredFields = ['username', 'password', 'fullname']

      requiredFields.forEach(field => {
        const registerAttemptBody = {
          username: 'test username',
          password: 'testPassword12@#',
          fullname: 'test fullname',
        }

        it(`responds with 400 required error when '${field}' is missing`, () => {
          delete registerAttemptBody[field]

          return supertest(app)
            .post('/api/users/signup')
            // .set('Authorization', 'bearer ' + token)
            .send(registerAttemptBody)
            .expect(400, {
              error: `Missing '${field}' in request body`,
            })
        })
      })

      it(`responds 400 'Password must be longer than 8 characters' when password is 8 or less`, () => {
        const userShortPassword = {
          username: 'test username',
          password: '1234567',
          fullname: 'test fullname',
        }
        return supertest(app)
          .post('/api/users/signup')
          .send(userShortPassword)
          .expect(400, { error: 'Password must be longer than 8 characters' })
      })

      it(`responds 400 'Password must be less than 72 characters' when long password`, () => {
        const userLongPassword = {
          username: 'test username',
          password: '*'.repeat(73),
          fullname: 'test fullname',
        }
        return supertest(app)
          .post('/api/users/signup')
          .send(userLongPassword)
          .expect(400, { error: 'Password must be less than 72 characters' })
      })
      it(`responds 400 error when password starts with spaces`, () => {
        const userPasswordStartsSpaces = {
          username: 'test username',
          password: ' 1Aa!2Bb@',
          fullname: 'test fullname',
        }
        return supertest(app)
          .post('/api/users/signup')
          .send(userPasswordStartsSpaces)
          .expect(400, { error: `Password must not start or end with empty spaces` })
      })
      it(`responds 400 error when password ends with spaces`, () => {
        const userPasswordEndsSpaces = {
          username: 'test username',
          password: '1Aa!2Bb@ ',
          fullname: 'test fullname',
        }
        return supertest(app)
          .post('/api/users/signup')
          .send(userPasswordEndsSpaces)
          .expect(400, { error: `Password must not start or end with empty spaces` })
      })
      it(`responds 400 error when password isn't complex enough`, () => {
        const userPasswordNotComplex = {
          username: 'test username',
          password: '11AAaabb',
          fullname: 'test fullname',
        }
        return supertest(app)
          .post('/api/users/signup')
          .send(userPasswordNotComplex)
          .expect(400, { error: `Password must contain 1 upper case, lower case, number and special character` })
      })
      it(`responds 400 'User name already taken' when username isn't unique`, () => {
        const duplicateUser = {
          username: testUser.username,
          password: '11AAaa!!',
          fullname: 'test fullname',
        }
        return supertest(app)
          .post('/api/users/signup')
          .send(duplicateUser)
          .expect(400, { error: `Username already taken` })
      })
    })

    context(`Happy path`, () => {
      it(`responds 201, serialized user, storing bcryped password`, () => {
        const newUser = {
          username: 'test username',
          password: '11AAaa!!',
          fullname: 'test fullname',
        }
        return supertest(app)
          .post('/api/users/signup')
          .send(newUser)
          .expect(201)
          .expect(res => {
            expect(res.body).to.have.property('id')
            expect(res.body.username).to.eql(newUser.username)
            expect(res.body.fullname).to.eql(newUser.fullname)
            expect(res.body).to.not.have.property('password')
            expect(res.headers.location).to.eql(`/api/users/signup/${res.body.id}`)
          })
          .expect(res =>
            db
              .from('motor_ferret_users')
              .select('*')
              .where({ id: res.body.id })
              .first()
              .then(row => {
                expect(row.username).to.eql(newUser.username)
                expect(row.fullname).to.eql(newUser.fullname)

                return bcrypt.compare(newUser.password, row.password)
              })
              .then(compareMatch => {
                expect(compareMatch).to.be.true
              })
          )
      })
    })
  })



})