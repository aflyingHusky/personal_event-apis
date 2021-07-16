import { EventsService } from './events.service'
import { Request, Response } from 'express'

export class EventsController{
  static eventsService: EventsService
  constructor() {
    EventsController.eventsService = new EventsService()
  }

  async createEvent(req, res: Response) {
    try {
      const { body, user } = req

      const event = await EventsController.eventsService.createOne({
        data: body,
        credentials: user as any,
      })

      res.status(201).send(event)
    } catch (error) {
      res.status(error?.statusCode || 500).send({ message: error.message })
    }
  }

  async findOneEvent(req, res: Response) {
    try {
      const { params, user } = req
      const event = await EventsController.eventsService.findOne({
        query: { _id: params.eventId },
        credentials: user as any,
      })

      res.status(200).send(event)
    } catch (error) {
      res.status(error?.statusCode || 500).send({ message: error.message })
    }
  }

  async updateOneEvent(req, res: Response) {
    try {
      const { params, user, body } = req

      const isUpdated = await EventsController.eventsService.updateOne({
        query: { _id: params.eventId },
        updateData: body,
        credentials: user as any,
      })

      res.status(200).send(isUpdated)
    } catch (error) {
      res.status(error?.statusCode || 500).send({ message: error.message })
    }
  }

  async deleteOneEvent(req, res: Response) {
    try {
      const { params, user } = req

      const isDelete = await EventsController.eventsService.deleteOne({
        query: { _id: params.eventId },
        credentials: user as any,
      })

      res.status(200).send(isDelete)
    } catch (error) {
      res.status(error?.statusCode || 500).send({ message: error.message })
    }
  }

  async findManyEvents(req, res: Response) {
    try {
      const { query, user } = req

      const events = await EventsController.eventsService.findMany({
        query,
        credentials: user as any,
      })

      res.status(200).send(events)
    } catch (error) {
      res.status(error?.statusCode || 500).send({ message: error.message })
    }
  }
}
