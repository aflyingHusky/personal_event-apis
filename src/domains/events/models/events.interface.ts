import { Document, Types } from 'mongoose'

export interface Events extends Document {
  eventName: string
  description?: string
  startDate?: Date
  dueDate: Date
  createdBy?: string
  updatedAt: string
  createdAt: string
}

export interface CreateOneData {
  eventName?: string
  description?: string
  startDate?: Date
  dueDate: Date
  createdBy?: string
}

export interface UpdateOneData {
  eventName?: string
  startDate?: Date
  dueDate?: Date
}

export interface FindOneQuery {
  _id?: Types.ObjectId | string
}

export interface FindManyQuery {
  eventName?: string
  startDate?: Date
  dueDate?: Date
  limit?: string
  offset?: string
  createdBy?: string
  isExpired?: boolean
}

export interface CreateOneService {
  data: CreateOneData
  credentials: Credentials
}

export interface UpdateOneService {
  query: FindOneQuery
  updateData: UpdateOneData
  credentials: Credentials
}

export interface FindOneService {
  query: FindOneQuery
  credentials: Credentials
}

export interface FindManyService {
  query: FindManyQuery
  credentials: Credentials
}

export interface Credentials {
  userId: string
}
