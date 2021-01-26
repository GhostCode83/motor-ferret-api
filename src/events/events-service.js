const EventsService = {
  getAllEvents(knex) {
    return knex.select('*').from('motor_ferret_events')
  },
  insertEvent(knex, newEvent) {
    return knex
      .insert(newEvent)
      .into('motor_ferret_events')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  getById(knex, id) {
    console.log('getById:', id)
    return knex
      .from('motor_ferret_events')
      .select('*')
      .where('id', id)
      .first()
  },
  deleteEvent(knex, id) {
    return knex('motor_ferret_events')
      .where({ id })
      .delete()
  },
  updateEvent(knex, id, newEventFields) {
    return knex('motor_ferret_events')
      .where({ id })
      .update(newEventFields)
  },
}

module.exports = EventsService
