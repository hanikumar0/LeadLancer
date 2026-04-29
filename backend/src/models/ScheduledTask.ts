import mongoose, { Document, Schema } from 'mongoose';

export interface IScheduledTask extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  status: string;
  payload: any;
  runAt: Date;
  lastRunAt?: Date;
  nextRunAt?: Date;
  attempts: number;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ScheduledTaskSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['scrape', 'email', 'whatsapp', 'audit', 'reminder'], required: true },
    status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
    payload: { type: Schema.Types.Mixed, default: {} },
    runAt: { type: Date, required: true },
    lastRunAt: { type: Date },
    nextRunAt: { type: Date },
    attempts: { type: Number, default: 0 },
    errorMessage: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IScheduledTask>('ScheduledTask', ScheduledTaskSchema);
