const express = require('express')
const AuthService = require('./auth-service')
const UsersService = require('../users/users-service')
const path = require('path')


const authRouter = express.Router()
const jsonBodyParser = express.json()

//login
authRouter
  .post('/login', jsonBodyParser, (req, res, next) => {
    const { username, password } = req.body
    const loginUser = { username, password }
    console.log('loginUser:', loginUser)

    for (const [key, value] of Object.entries(loginUser))
      if (value == null) {
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })
      }

    AuthService.getUserWithUserName(
      req.app.get('db'),
      loginUser.username
    )

      .then(dbUser => {
        console.log(1, dbUser)
        if (!dbUser) {
          return res.status(400).json({
            error: 'Incorrect username or password',
          })

        }
        return AuthService.comparePasswords(loginUser.password, dbUser.password)
          .then(compareMatch => {
            if (!compareMatch)
              return res.status(400).json({
                error: 'Incorrect username or password',
              })
            console.log('admin', dbUser.admin)
            const sub = dbUser.username
            const payload = { user_id: dbUser.id }
            console.log(payload, sub)
            res.send({
              authToken: AuthService.createJwt(sub, payload),
              userId: dbUser.id,
              admin: dbUser.admin
            })
          })
      })
      .catch(next)
  })
  .post('/signup', jsonBodyParser, (req, res, next) => {
    const { password, username, fullname, admin } = req.body
    console.log(password, username, fullname)
    for (const field of ['fullname', 'username', 'password'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })
    const passwordError = UsersService.validatePassword(password)
    console.log(passwordError)
    if (passwordError)
      return res.status(400).json({ error: passwordError })

    UsersService.hasUserWithUserName(
      req.app.get('db'),
      username
    )
      .then(hasUserWithUserName => {
        if (hasUserWithUserName)
          return res.status(400).json({ error: `Username already taken` })

        return UsersService.hashPassword(password)
          .then(hashedPassword => {
            const newUser = {
              username,
              password: hashedPassword,
              fullname,
              start_date: 'now()',
              admin
            }
            console.log(newUser)
            return UsersService.insertUser(
              req.app.get('db'),
              newUser
            )
              .then(user => {
                res
                  .status(201)
                  .location(path.posix.join(req.originalUrl, `/${user.id}`))
                  .json(UsersService.serializeUser(user))
              })
          })
      })
      .catch(next)
  })

module.exports = authRouter
