import * as mongoose from 'mongoose'

export const UsersSchema = new mongoose.Schema(
  {
    fullName: { type: String },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  },
)

export const UsersModel = mongoose.model('users', UsersSchema)
