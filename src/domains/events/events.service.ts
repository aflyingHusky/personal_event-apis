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
      const event = await this.eventsModel.findOne({ ...query, userId })
        .populate('createdBy')
        .exec()

      if (!event) {
        return Promise.reject({
          statusCode: 404,
          message: 'User Not Found!',
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
      const event = await this.eventsModel.findOne({ ...query, userId }).exec()

      if (!event) {
        return Promise.reject({
          statusCode: 404,
          message: 'User Not Found!',
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
      const event = await this.eventsModel.findOne({ ...query, userId }).exec()

      if (!event) {
        return Promise.reject({
          statusCode: 404,
          message: 'User Not Found!',
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

      const findingQuery = { createdBy: credentials.userId, ...restOfQuery }

      const promises: any = []
      promises.push(
        this.eventsModel.find(findingQuery)
          .populate('createdBy')
          .limit(Number(limit))
          .skip(Number(offset))
          .exec(),
        this.eventsModel.countDocuments(findingQuery)
        .exec())

      const [events, totalCount] = await Promise.all(promises)

      return {
        totalCount: totalCount || 0,
        events: events || [],
      }
    } catch (error) {
      return Promise.reject()
    }
  }
}
