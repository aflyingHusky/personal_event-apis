import { Model } from 'mongoose'
import { CreateUserService, FindOneService, Users } from './models/users.interface'
import { UsersModel } from './models/users.schema'

export class UsersService {
  private readonly usersModel: Model<any>
  constructor() {
    this.usersModel = UsersModel
  }

  async createOne({ data }: CreateUserService): Promise<Users> {
    try {
      const user = new this.usersModel(data)

      await user.save()

      return user
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async findOne({ query, needToCheckExists = true }: FindOneService): Promise<Users> {
    try {
      const user = await this.usersModel.findOne(query).exec()

      if (!user && needToCheckExists) {
        return Promise.reject({
          statusCode: 404,
          message: 'User Not Found!',
        })
      }

      return user
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
