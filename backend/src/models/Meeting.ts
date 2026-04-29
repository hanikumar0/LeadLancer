import mongoose, { Document, Schema } from 'mongoose';

export interface IMeeting extends Document {
  userId: mongoose.Types.ObjectId;
  leadId: mongoose.Types.ObjectId;
  dealId?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  meetingType: string;
  startTime: Date;
  endTime: Date;
  timezone: string;
  status: string;
  meetingLink?: string;
  reminderSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MeetingSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true },
    dealId: { type: Schema.Types.ObjectId, ref: 'Deal' },
    title: { type: String, required: true },
    description: { type: String },
    meetingType: { type: String, enum: ['call', 'zoom', 'google-meet', 'in-person'], default: 'zoom' },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    timezone: { type: String, default: 'UTC' },
    status: { type: String, enum: ['scheduled', 'completed', 'no-show', 'rescheduled', 'cancelled'], default: 'scheduled' },
    meetingLink: { type: String },
    reminderSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IMeeting>('Meeting', MeetingSchema);
