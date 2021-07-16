import * as express from 'express'
import routes from './routes'
import { json } from 'body-parser'
import * as mongoose from 'mongoose'
import { Configurations } from './config'

const config = new Configurations()

export const init = async () => {
  try {
    const app: express.Application = express()
    app.use(json())
    app.use(routes)

    await mongoose.connect(config.dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log('Connect to database succeed! --------')

    return app
  } catch (error) {
    console.log('Failed to connect database')
  }
}

export const start = async () => {
  try {
    const app = await init()

    app.listen(config.apiPort || 3000)

    console.log(`Server started at ${config.apiHost}:${config.apiPort}`)
  } catch (err) {
    console.error('Error starting server: ', err.message)

    throw err
  }
}

start()
