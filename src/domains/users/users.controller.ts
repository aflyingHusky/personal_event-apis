import { UsersService } from './users.service'
import * as bcrypt from 'bcrypt'
import { Configurations } from '../../config'
import * as jwt from 'jsonwebtoken'
import { Request, Response } from 'express'

const configsService = new Configurations()

export class UsersController{
  static usersService: UsersService
  constructor() {
    UsersController.usersService = new UsersService()
  }

  async signUp(req: Request, res: Response) {
    try {
      const { body } = req

      const { username, password, fullName } = body

      const userExisted = await UsersController.usersService.findOne({
        query: { username },
        needToCheckExists: false,
      })

      if (userExisted) {
        return Promise.reject({
          code: 400,
          message: 'Username Already Exist',
        })
      }

      const hashedPassword = await bcrypt.hash(password, configsService.bcryptSalt)

      const newUser = await UsersController.usersService.createOne({
        data: { username, password: hashedPassword, fullName },
      })

      const accessToken = jwt.sign(
        {
          userId: newUser._id,
          fullName,
        },
        configsService.jwt_secret,
        { expiresIn: '30d' },
      )

      return res.status(201).send({
        accessToken,
        fullName,
      })
    } catch (error) {
      res.status(error?.code || 500).send({ message: error.message })
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body

      const user = await UsersController.usersService.findOne({
        query: { username },
      })

      const isValidPassword = await bcrypt.compareSync(password, user.password)

      if (isValidPassword) {
        throw {
          code: 400,
          message: 'Password Is Not Correct',
        }
      }

      const accessToken = jwt.sign(
        {
          userId: user._id,
          fullName: user.fullName,
        },
        configsService.jwt_secret,
        { expiresIn: '30d' },
      )

      res.status(200).send({
        accessToken,
        fullName: user.fullName,
      })
    } catch (error) {
      console.log(error)
      res.status(error?.code || 500).send({ message: error.message })
    }
  }
}
