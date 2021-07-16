import { Router } from 'express'
import userRouter from './domains/users/users.routes'
import eventRouter from './domains/events/events.routes'

const routes: Router = Router()

routes.use(userRouter)
routes.use(eventRouter)

routes.use('/', (req, res)  => {
  return res.json('OK')
})

export default routes
