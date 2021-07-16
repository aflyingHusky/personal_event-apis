import { Request, Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'
import { UsersService } from '../../domains/users/users.service'
import { Configurations } from '../../config'

const configsService = new Configurations()
const usersService = new UsersService()
const unauthorizedError = {
  statusCode: 401,
  message: 'Unauthorized!',
}

export const verifyToken = async (req, res: Response, next: NextFunction) => {
  try {
    const BearerToken: string = req.headers.authorization

    if (!BearerToken) {
      res.status(401).send(unauthorizedError)
    }

    const accessToken = BearerToken.replace('Bearer ', '')

    const payload = jwt.verify(accessToken, configsService.jwt_secret)

    const user = await usersService.findOne({
      query: { _id: payload.userId },
      needToCheckExists: false,
    })

    if (!user) {
      res.status(401).send(unauthorizedError)
    }

    req.user = {
      userId: user._id,
      fullName: user.fullName,
    }

    next()
  } catch (error) {
    res.status(401).send(unauthorizedError)
  }
}
