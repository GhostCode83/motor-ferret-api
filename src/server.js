require('dotenv').config()

const knex = require('knex')
const app = require('./app')
const { PORT, DATABASE_URL } = require('./config');

// app.get('/api/*', (req, res) => {
//   res.json({ ok: true });
// });

const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
  ssl: true,
})

app.set('db', db)

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
}
);
