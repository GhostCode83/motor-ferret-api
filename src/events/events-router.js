
const path = require('path')
const express = require('express')
const xss = require('xss')
const EventsService = require('./events-service')
const { requireAuth } = require('../middleware/jwt-auth')

const eventsRouter = express.Router()
const jsonParser = express.json()

const serializeEvent = event => ({
  id: event.id,
  title: xss(event.title),
  date1: event.date1,
  date2: event.date2,
  organizer: xss(event.organizer),
  website: xss(event.website),
  event_type: event.event_type,
  event_description: xss(event.event_description),
  address: xss(event.address),
  address2: xss(event.address2),
  city: xss(event.city),
  state: xss(event.state),
  zip: xss(event.zip)
})

eventsRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    // console.log('get req body and params', req.body, req.params)
    const knexInstance = req.app.get('db')

    EventsService.getAllEvents(knexInstance)
      .then(events => {
        // console.log(events)
        res.json(events.map(serializeEvent))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const {
      title,
      date1,
      date2,
      organizer,
      website,
      event_type,
      event_description,
      address,
      address2,
      city,
      state,
      zip } = req.body

    const newEvent = {
      title,
      date1: new Date(date1),
      organizer,
      website,
      event_type,
      event_description,
      address,
      address2,
      city,
      state,
      zip
    }

    if (date2) {
      newEvent.date2 = date2
    }

    for (const [key, value] of Object.entries(newEvent))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
    EventsService.insertEvent(
      req.app.get('db'),
      newEvent
    )
      .then(event => {
        // console.log(event)
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${event.id}`))
          .json(serializeEvent(event))
      })
      .catch(next)
  })

eventsRouter
  .route('/:event_id')
  .all(requireAuth)
  .all((req, res, next) => {
    // console.log(2, req.params.event_id)

    EventsService.getById(
      req.app.get('db'),
      Number(req.params.event_id)
    )
      .then(event => {
        if (!event) {
          return res.status(404).json({
            error: { message: `Event doesn't exist` }
          })
        }
        res.event = event // save the event for the next middleware
        next() // don't forget to call next so the next middleware happens!
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json({
      id: res.event.id,
      title: xss(res.event.title),
      date1: res.event.date1,
      date2: res.event.date2,
      organizer: xss(res.event.organizer),
      website: xss(res.event.website),
      event_type: res.event.event_type,
      event_description: xss(res.event.event_description),
      address: xss(res.event.address),
      address2: xss(res.event.address2),
      city: xss(res.event.city),
      state: xss(res.event.state),
      zip: xss(res.event.zip)
    })

  })
  .delete((req, res, next) => {
    // console.log(3, req.params.event_id)
    EventsService.deleteEvent(
      req.app.get('db'),
      Number(req.params.event_id)
    )
      .then(() => {
        res.status(204).end()
      })
      .catch(next)
  })


module.exports = eventsRouter