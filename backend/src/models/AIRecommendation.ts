import mongoose, { Document, Schema } from 'mongoose';

export interface IAIRecommendation extends Document {
  userId: mongoose.Types.ObjectId;
  category: string;
  title: string;
  description: string;
  priority: string;
  actionUrl?: string;
  isDismissed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AIRecommendationSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, enum: ['growth', 'outreach', 'crm', 'productivity'], required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
    actionUrl: { type: String },
    isDismissed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IAIRecommendation>('AIRecommendation', AIRecommendationSchema);
