import * as dotenv from 'dotenv'

export class Configurations {
  constructor () {
    const env = process.env.NODE_ENV || 'dev'
    console.log(`Node env ${env}`)

    const envFilePath = env === 'dev' ? '.env' : '.test.env'

    dotenv.config({
      path: `${process.cwd()}/${envFilePath}`,
    })
  }

  get dbName(): string {
    return String(process.env.DATABASE_NAME)
  }

  get dbUser(): string {
    return String(process.env.DATABASE_USER)
  }

  get dbPass(): string {
    return String(process.env.DATABASE_PASSWORD)
  }

  get dbHost(): string {
    return String(process.env.DATABASE_HOST)
  }

  get apiHost(): string {
    return String(process.env.API_HOST)
  }

  get apiPort(): number {
    return Number(process.env.API_PORT)
  }

  get bcryptSalt(): number {
    return Number(process.env.BCRYPT_SALT)
  }

  get jwt_secret(): string {
    return String(process.env.JWT_SECRET)
  }

  get dbUri(): string {
    return `mongodb+srv://${this.dbUser}:${this.dbPass}@${this.dbHost}/${this.dbName}?retryWrites=true&w=majority&=true`
  }
}
