import mongoose, { Document, Schema } from 'mongoose';

export interface IScrapeJob extends Document {
  userId: mongoose.Types.ObjectId;
  keyword: string;
  location: string;
  source: string;
  totalFound: number;
  successCount: number;
  failedCount: number;
  status: string;
  startedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ScrapeJobSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    keyword: { type: String, required: true },
    location: { type: String, required: true },
    source: { type: String, required: true },
    totalFound: { type: Number, default: 0 },
    successCount: { type: Number, default: 0 },
    failedCount: { type: Number, default: 0 },
    status: { type: String, enum: ['Running', 'Completed', 'Failed'], default: 'Running' },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IScrapeJob>('ScrapeJob', ScrapeJobSchema);
