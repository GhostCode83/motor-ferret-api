const express = require('express')
const AuthService = require('./auth-service')

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
        console.log(dbUser)
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

module.exports = authRouter
