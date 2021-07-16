import { Router } from 'express'
import { validate } from '../../helpers/validate'
import { verifyToken } from '../../middleware/auth/authJwt'
import { EventsController } from './events.controller'
import { createOneDto, findManyDto, paramDto, updateOneDto } from './models/events.dto'

const eventsController = new EventsController()

const eventRouter: Router = Router()

eventRouter.post('/events',
  verifyToken,
  validate(createOneDto),
  eventsController.createEvent,
)

eventRouter.put('/events/:eventId',
  verifyToken,
  validate(updateOneDto),
  eventsController.updateOneEvent,
)

eventRouter.get('/events',
  verifyToken,
  validate(findManyDto),
  eventsController.findManyEvents,
)

eventRouter.get('/events/:eventId',
  verifyToken,
  validate(paramDto),
  eventsController.updateOneEvent,
)

eventRouter.delete('/events/:eventId',
  verifyToken,
  validate(paramDto),
  eventsController.deleteOneEvent,
)

export default eventRouter
