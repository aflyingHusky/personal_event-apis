import { Model } from 'mongoose'
import { Events, CreateOneService, FindOneService, UpdateOneService, FindManyService } from './models/events.interface'
import { EventsModel } from './models/events.schema'

export class EventsService {
  private readonly eventsModel: Model<any>

  constructor() {
    this.eventsModel = EventsModel
  }

  async createOne({ data, credentials }: CreateOneService): Promise<Events> {
    try {
      const event = new this.eventsModel({
        createdBy: credentials.userId,
        ...data,
      })

      await event.save(event)

      return event
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async findOne({ query, credentials }: FindOneService): Promise<Events> {
    try {
      const { userId } = credentials
      const event = await this.eventsModel.findOne(query)
        .populate('createdBy')
        .exec()

      if (!event) {
        return Promise.reject({
          statusCode: 404,
          message: 'User Not Found!',
        })
      }

      if (event.createdBy._id.toString() !== userId) {
        return Promise.reject({
          statusCode: 403,
          message: 'No permission!',
        })
      }

      return event
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async updateOne({ query, updateData, credentials }: UpdateOneService): Promise<Events> {
    try {
      const { userId } = credentials
      const event = await this.eventsModel.findOne(query).exec()

      if (!event) {
        return Promise.reject({
          statusCode: 404,
          message: 'User Not Found!',
        })
      }

      if (event.createdBy.toString() !== userId) {
        return Promise.reject({
          statusCode: 403,
          message: 'No permission!',
        })
      }

      Object.assign(event, updateData)

      await event.save()

      return event
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async deleteOne({ query, credentials }: FindOneService): Promise<boolean> {
    try {
      const { userId } = credentials
      const event = await this.eventsModel.findOne(query).exec()

      if (!event) {
        return Promise.reject({
          statusCode: 404,
          message: 'User Not Found!',
        })
      }

      if (event.createdBy.toString() !== userId) {
        return Promise.reject({
          statusCode: 403,
          message: 'No permission!',
        })
      }

      await this.eventsModel.deleteOne(query).exec()

      return event
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async findMany({ query, credentials }: FindManyService): Promise<any> {
    try {
      const { limit = 10, offset = 0, isExpired, ...restOfQuery } = query

      if (isExpired) {
        restOfQuery.dueDate = {
          $lte: new Date(),
        } as any
      }

      const findingQuery = { ...restOfQuery }

      const promises: any = []
      promises.push(
        this.eventsModel.find(findingQuery)
          .populate('createdBy')
          .limit(Number(limit))
          .skip(Number(offset))
          .exec(),
        this.eventsModel.countDocuments(findingQuery)
        .exec())

      const [events, totalCount]: any = await Promise.all(promises)

      const validEvents = events?.map(each => {
        if (each.createdBy._id.toString() === credentials.userId) {
          return each
        }

        return null
      }) || []

      return {
        totalCount: totalCount || 0,
        list: validEvents,
      }
    } catch (error) {
      return Promise.reject()
    }
  }
}
