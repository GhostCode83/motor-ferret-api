const xss = require('xss')
const bcrypt = require('bcryptjs')
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UsersService = {
  getAllUsers(knex) {
    return knex.select('*').from('motor_ferret_users')
  },
  getById(db, id) {
    return UsersService.getAllUsers(db)
      .where('motor_ferret_users.id', id)
      .first()
  },
  hasUserWithUserName(db, username) {
    return db('motor_ferret_users')
      .where({ username })
      .first()
      .then(user => !!user)
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('motor_ferret_users')
      .returning('*')
      .then(([user]) => user)
  },
  validatePassword(password) {
    if (password.length < 8) {
      return 'Password must be longer than 8 characters'
    }
    if (password.length > 72) {
      return 'Password must be less than 72 characters'
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces'
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain 1 upper case, lower case, number and special character'
    }
    return null
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12)
  },
  serializeUser(user) {
    return {
      id: user.id,
      fullname: xss(user.fullname),
      username: xss(user.username),
      start_date: new Date(user.start_date),
    }
  },
  updateUser(knex, id, newUserFields) {
    return knex('motor_ferret_users')
      .where({ id })
      .update(newUserFields)
  },
}

module.exports = UsersService