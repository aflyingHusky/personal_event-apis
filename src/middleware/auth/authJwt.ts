import * as jwt from 'jsonwebtoken'
import { Configurations } from '../../config'

const configsService = new Configurations()

export const verifyToken = (req, res, next) => {
  try {
    const accessToken = req.headers['x-access-token']

    if (!accessToken) {
      return res.status(401).send({ code: 401, message: 'Unauthorized!' })
    }

    const payload = jwt.verify(accessToken, configsService.jwt_secret)

    req.userId = payload.userId

    next()
  } catch (error) {
    res.code(401).send({ code: 401, message: 'Unauthorized!' })
  }
}
