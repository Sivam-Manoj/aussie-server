import { Schema, model, Document, Types } from 'mongoose';

interface ICalendarEvent extends Document {
  id: string;
  date: Date;
  comment: string;
  createdAt: Date;
  type: 'regular' | 'season-start' | 'season-end';
  userId: Types.ObjectId;
}

interface ISeason extends Document {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  notificationSent: boolean;
  userId: Types.ObjectId;
}

// Calendar Event Schema
const CalendarEventSchema = new Schema<ICalendarEvent>({
  date: {
    type: Date,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['regular', 'season-start', 'season-end'],
    default: 'regular'
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

// Season Schema
const SeasonSchema = new Schema<ISeason>({
  name: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  notificationSent: {
    type: Boolean,
    default: false
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
CalendarEventSchema.index({ userId: 1, date: 1 });
SeasonSchema.index({ userId: 1, startDate: 1, endDate: 1 });

// Create models
export const CalendarEvent = model<ICalendarEvent>('CalendarEvent', CalendarEventSchema);
export const Season = model<ISeason>('Season', SeasonSchema);

// Export interfaces
export type { ICalendarEvent, ISeason };