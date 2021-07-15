import { Document } from 'mongoose'

export interface Users extends Document {
  fullName?: string
  username: string
  password: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateUserData {
  fullName?: string
  username: string
  password: string
}

export interface CreateUserService {
  data: CreateUserData
}

export interface FindOneQuery {
  _id?: string
  username?: string
}

export interface FindOneService {
  query: FindOneQuery
  needToCheckExists?: boolean
}
