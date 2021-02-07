module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  // DATABASE_URL: process.env.DATABASE_URL || 'postgresql://ferret_admin@localhost/motor_ferret',
  DATABASE_URL: process.env.DATABASE_URL || 'postgres://dtbcetevkdtznw:5fff5482c64c3f8b9fa42830fd0b7a45a831b0e813e6f7c26bf629addfa1b70b@ec2-54-162-119-125.compute-1.amazonaws.com:5432/dasrgjas97a1gi?ssl=true',

  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://ferret_admin@localhost/motor_ferret_test',
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret'
}
