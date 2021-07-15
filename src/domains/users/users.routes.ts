import { Router } from 'express'
import { UsersController } from './users.controller'
import { validate } from '../../helpers/validate'
import { loginDto, signUpDto } from './models/users.dto'

const usersController = new UsersController()

const userRouter: Router = Router()

userRouter.post('/auth/signup',
  validate(signUpDto),
  usersController.signUp)

userRouter.post('/auth/login',
  validate(loginDto),
  usersController.login)

export default userRouter
