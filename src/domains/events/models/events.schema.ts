import * as mongoose from 'mongoose'
const { Types } = mongoose.Schema

export const EventsSchema = new mongoose.Schema(
  {
    eventName: { type: String },
    description: { type: String },
    startDate: { type: Date, default: new Date() },
    dueDate: { type: Date, required: true },
    createdBy: { type: Types.ObjectId, ref: 'Users' },
  },
  {
    timestamps: true,
  },
)

export const EventsModel = mongoose.model('event', EventsSchema)
