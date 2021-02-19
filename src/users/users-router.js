const express = require('express')
const path = require('path')
const xss = require('xss')
const authRouter = require('../auth/auth-router')
const { requireAuth } = require('../middleware/jwt-auth')
const UsersService = require('./users-service')
const usersRouter = express.Router()
const jsonBodyParser = express.json()

const serializeUser = user => ({
  id: user.id,
  fullname: xss(user.fullname),
  username: xss(user.username),
  start_date: user.start_date,
  profile_picture: xss(user.profile_picture),
  flagged: user.flagged,
  blocked: user.blocked
})

usersRouter
  .route('/')
  //get all users
  .all(requireAuth)
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')

    UsersService.getAllUsers(knexInstance)
      .then(users => {
        // console.log(users)
        res.json(users.map(serializeUser))
      })
      .catch(next)
  })
//add a new user

usersRouter
  .post('/signup', jsonBodyParser, (req, res, next) => {
    const { password, username, fullname, admin } = req.body
    // console.log(11, password, username, fullname, admin)
    for (const field of ['fullname', 'username', 'password'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })

    const passwordError = UsersService.validatePassword(password)
    // console.log(12, passwordError)

    if (passwordError)
      return res.status(400).json({ error: passwordError })

    UsersService.hasUserWithUserName(
      req.app.get('db'),
      username
    )
      .then(hasUserWithUserName => {
        // console.log(13, hasUserWithUserName)
        if (hasUserWithUserName)
          return res.status(400).json({ error: `Username already taken` })

        return UsersService.hashPassword(password)
          .then(hashedPassword => {
            // console.log(14, hashedPassword)
            const newUser = {
              username,
              password: hashedPassword,
              fullname,
              start_date: 'now()',
              admin
            }
            // console.log(15, newUser)
            return UsersService.insertUser(
              req.app.get('db'),
              newUser
            )
              .then(user => {
                // console.log(16, req.originalUrl, user.id, user)
                res
                  .status(201)
                  .location(path.posix.join(req.originalUrl, `/${user.id}`))
                  .json(UsersService.serializeUser(user))
              })
          })
      })
      .catch(next)
  })

usersRouter
  .route('/:user_id')
  .all(requireAuth)
  .all(checkUserExists)
  .get((req, res) => {
    res.json(serializeUser(res.user))
  })


usersRouter
  .route('/admin/:user_id')
  .all(requireAuth)
  .all(checkUserExists)
  .get((req, res) => {
    res.json(serializeUser(res.user))
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const { flagged, blocked, admin } = req.body
    const userToUpdate = { flagged, blocked, admin }
    // console.log(userToUpdate)
    const numberOfValues = Object.values(userToUpdate).filter(Boolean).length
    // console.log('number of values: ', numberOfValues)
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'flagged', 'blocked', or 'admin'`
        }
      })

    UsersService.updateUser(
      req.app.get('db'),
      req.params.user_id,
      userToUpdate
    )
      .then(response => {
        console.log(response)
        res.status(204).json()
      })
      .catch(next)
  })

async function checkUserExists(req, res, next) {
  try {
    const user = await UsersService.getById(
      req.app.get('db'),
      req.params.user_id
    )

    if (!user)
      return res.status(404).json({
        error: `User doesn't exist`
      })

    res.user = user
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = usersRouter
