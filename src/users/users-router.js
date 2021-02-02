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
  .route('/:user_id')
  .all(requireAuth)
  .all(checkUserExists)
  .get((req, res) => {
    res.json(serializeUser(res.user))
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const { fullname, username, password } = req.body
    const userToUpdate = { fullname, username, password }

    const numberOfValues = Object.values(userToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'fullname', 'username', or 'password'`
        }
      })

    UsersService.updateUser(
      req.app.get('db'),
      req.params.user_id,
      userToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
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
    console.log(userToUpdate)
    const numberOfValues = Object.values(userToUpdate).filter(Boolean).length
    console.log('number of values: ', numberOfValues)
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
      .then(numRowsAffected => {
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
