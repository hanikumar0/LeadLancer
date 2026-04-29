import mongoose, { Document, Schema } from 'mongoose';

export interface IOutreachCampaign extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  type: string;
  templateId?: mongoose.Types.ObjectId;
  status: string;
  totalRecipients: number;
  sentCount: number;
  failedCount: number;
  repliedCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const OutreachCampaignSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['single', 'bulk'], required: true },
    templateId: { type: Schema.Types.ObjectId, ref: 'Template' },
    status: { type: String, enum: ['draft', 'running', 'paused', 'completed'], default: 'draft' },
    totalRecipients: { type: Number, default: 0 },
    sentCount: { type: Number, default: 0 },
    failedCount: { type: Number, default: 0 },
    repliedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IOutreachCampaign>('OutreachCampaign', OutreachCampaignSchema);
