import { Configurations } from '../../config'
import { EventsService } from './events.service'
import { CreateOneData } from './models/events.interface'
import * as mongoose from 'mongoose'
import { UsersService } from '../users/users.service'

describe('Event domain', () => {
  let configsService: Configurations
  let eventsService: EventsService
  let usersService: UsersService
  let credentials
  let anotherUser
  let conn: mongoose.Connection

  beforeAll(async () => {
    configsService = new Configurations()
    await mongoose.connect(configsService.dbUri)

    try {
      conn = await mongoose.createConnection(configsService.dbUri)
      await conn.dropCollection('events')
      await conn.dropCollection('users')

    } catch (error) {
      console.log(error)
    }

    eventsService = new EventsService()
    usersService = new UsersService()

    const userInfo = {
      username: 'test',
      password: 'hi',
      fullName: 'testing',
    }

    const [firstUser, secondUser] = await Promise.all([
      usersService.createOne({
        data: userInfo,
      }),
      usersService.createOne({
        data: { ...userInfo, username: 'hihihaha' },
      }),
    ])

    credentials = { userId: firstUser._id.toString() }
    anotherUser = { userId: secondUser._id.toString() }

  }, 30000)

  it('should be defined', () => {
    expect(eventsService).toBeDefined()
  })

  it('should return new event', async () => {
    const createOneData: CreateOneData = {
      dueDate: new Date('2021/7/12'),
      startDate: new Date('2021/7/2'),
      eventName: 'test',
    }

    const event = await eventsService.createOne({
      credentials,
      data: createOneData,
    })

    await eventsService.createOne({
      credentials: anotherUser,
      data: createOneData,
    })

    expect(event._id).toBeDefined()
    expect(event.createdBy.toString()).toEqual(credentials.userId)
  })

  it('should return an event object when finding an event by user is owner', async () => {
    const createOneData: CreateOneData = {
      dueDate: new Date('2021/7/30'),
      startDate: new Date(),
      eventName: 'test',
    }

    const event = await eventsService.createOne({
      credentials,
      data: createOneData,
    })

    const eventFound: any = await eventsService.findOne({
      query: { _id: event._id },
      credentials,
    })

    expect(eventFound).toBeDefined()
    expect(eventFound.createdBy._id.toString()).toEqual(credentials.userId)
  })

  it('should throw 403 statusCode error when finding an event by user is not owner', async () => {
    try {
      const createOneData: CreateOneData = {
        dueDate: new Date('2021/7/30'),
        startDate: new Date(),
        eventName: 'test',
      }

      const event = await eventsService.createOne({
        credentials,
        data: createOneData,
      })

      await eventsService.findOne({
        query: { _id: event._id },
        credentials: anotherUser,
      })

    } catch (error) {
      expect(error.statusCode).toEqual(403)
    }
  })

  it('should throw 404 statusCode error when finding an event not exists', async () => {
    try {
      const id = mongoose.Types.ObjectId()

      await eventsService.findOne({
        query: { _id: id },
        credentials: anotherUser,
      })

    } catch (error) {
      expect(error.statusCode).toEqual(404)
    }
  })

  it('should return true when updating event by user is owner', async () => {
    const createOneData: CreateOneData = {
      dueDate: new Date('2021/7/30'),
      startDate: new Date(),
      eventName: 'test',
    }

    const event = await eventsService.createOne({
      credentials,
      data: createOneData,
    })

    const result = await eventsService.updateOne({
      query: { _id: event._id },
      updateData: { eventName: 'updated' },
      credentials,
    })

    expect(result).toBeTruthy()

    const eventFound = await eventsService.findOne({
      query: { _id: event._id },
      credentials,
    })

    expect(eventFound.eventName).toEqual('updated')
  })

  it('should return 403 error when finding by user is not owner', async () => {
    try {
      const createOneData: CreateOneData = {
        dueDate: new Date('2021/7/30'),
        startDate: new Date(),
        eventName: 'test',
      }

      const event = await eventsService.createOne({
        credentials,
        data: createOneData,
      })

      await eventsService.updateOne({
        query: { _id: event._id },
        updateData: { eventName: 'updated' },
        credentials: anotherUser,
      })

    } catch (error) {
      expect(error.statusCode).toEqual(403)
    }
  })

  it('should throw 404 statusCode error when updating an event not exists', async () => {
    try {
      const id = mongoose.Types.ObjectId()

      await eventsService.updateOne({
        query: { _id: id },
        updateData: { eventName: 'hi' },
        credentials: anotherUser,
      })

    } catch (error) {
      expect(error.statusCode).toEqual(404)
    }
  })

  it('should return an event object when removing an event by user is owner', async () => {
    const createOneData: CreateOneData = {
      dueDate: new Date('2021/7/30'),
      startDate: new Date(),
      eventName: 'test',
    }

    const event = await eventsService.createOne({
      credentials,
      data: createOneData,
    })

    const isDeleted = await eventsService.deleteOne({
      query: { _id: event._id },
      credentials,
    })

    expect(isDeleted).toBeTruthy()
  })

  it('should throw 403 statusCode error when removing an event by user is not owner', async () => {
    try {
      const createOneData: CreateOneData = {
        dueDate: new Date('2021/7/30'),
        startDate: new Date(),
        eventName: 'test',
      }

      const event = await eventsService.createOne({
        credentials,
        data: createOneData,
      })

      await eventsService.deleteOne({
        query: { _id: event._id },
        credentials: anotherUser,
      })

    } catch (error) {
      expect(error.statusCode).toEqual(403)
    }
  })

  it('should throw 404 statusCode error when removing an event not exists', async () => {
    try {
      const id = mongoose.Types.ObjectId()

      await eventsService.deleteOne({
        query: { _id: id },
        credentials: anotherUser,
      })

    } catch (error) {
      expect(error.statusCode).toEqual(404)
    }
  })

  it('should return list of events when finding events with valid credentials', async () => {
    const { list } = await eventsService.findMany({
      query: { },
      credentials,
    })

    list?.forEach(each => {
      if (!each) {
        return
      }
      expect(each._id).toBeDefined()
    })

    const isHasNullElement = list.some(each => !each)
    expect(isHasNullElement).toBeTruthy()
  })

  it('should return list of null when finding events with invalid credentials', async () => {
    const { list } = await eventsService.findMany({
      query: { },
      credentials: { userId: 'aabcd' },
    })

    const isNullAll = list.every(each => each === null)

    expect(isNullAll).toBeTruthy()
  })

  it('should return list of ended events when finding events with query: isExpired', async () => {
    const { list } = await eventsService.findMany({
      query: { isExpired: true },
      credentials: { userId: 'aabcd' },
    })

    list?.forEach(each => {
      if (!each) {
        return
      }
      expect((new Date(each.endDate)).getTime()).toBeLessThanOrEqual((new Date()).getTime())
    })
  })

  afterAll(async () => {
    await conn.close()
  })
})
