import mongoose, { Document, Schema } from 'mongoose';

export interface IOutreachLog extends Document {
  userId: mongoose.Types.ObjectId;
  leadId: mongoose.Types.ObjectId;
  campaignId?: mongoose.Types.ObjectId;
  channel: string;
  toEmail: string;
  subject: string;
  message: string;
  sendStatus: string;
  providerMessageId?: string;
  openedAt?: Date;
  repliedAt?: Date;
  bouncedAt?: Date;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OutreachLogSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true },
    campaignId: { type: Schema.Types.ObjectId, ref: 'OutreachCampaign' },
    channel: { type: String, default: 'email' },
    toEmail: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    sendStatus: { type: String, enum: ['pending', 'sent', 'failed', 'delivered', 'opened', 'replied', 'bounced'], default: 'pending' },
    providerMessageId: { type: String },
    openedAt: { type: Date },
    repliedAt: { type: Date },
    bouncedAt: { type: Date },
    errorMessage: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IOutreachLog>('OutreachLog', OutreachLogSchema);
