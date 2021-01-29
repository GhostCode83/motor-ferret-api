module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://ferret_admin@localhost/motor_ferret',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://ferret_admin@localhost/motor_ferret_test',
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
}
