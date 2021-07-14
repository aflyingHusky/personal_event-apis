import { Router } from 'express'
import userRouter from './domains/users/users.routes'

const routes: Router = Router()

routes.get('/', (req, res)  => {
  return res.json('OK')
})

routes.use(userRouter)

export default routes
