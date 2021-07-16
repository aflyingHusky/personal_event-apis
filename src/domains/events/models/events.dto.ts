import { body, query, param } from 'express-validator'

export const createOneDto = [
  body('eventName').isString().exists(),
  body('description').isString().optional(),
  body('startDate').isDate().optional(),
  body('dueDate').isDate().exists(),
]

export const updateOneDto = [
  body('eventName').isString().optional(),
  body('description').isString().optional(),
  body('startDate').isDate().optional(),
  body('dueDate').isDate().optional(),
]

export const findManyDto = [
  query('eventName').isString().optional(),
  query('startDate').isDate().optional(),
  query('dueDate').isDate().optional(),
  query('isExpired').isBoolean().optional(),
  query('limit').isNumeric().optional().default(15),
  query('offset').isNumeric().optional(),
]

export const paramDto = [
  param('eventId').isMongoId().optional(),
]
