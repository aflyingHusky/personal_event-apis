import { body } from 'express-validator'
export const signUpDto = [
  body('username').isString().exists(),
  body('password').isString().exists(),
  body('fullName').isString().optional(),
]

export const loginDto = [
  body('username').isString().exists(),
  body('password').isString().exists(),
]
