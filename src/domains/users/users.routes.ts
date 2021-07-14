import { Router } from 'express'

const userRouter: Router = Router()

userRouter.get('/users/me', (req, res) => {
  return res.send('users/me')
})

export default userRouter
