import mongoose, { Document, Schema } from 'mongoose';

export interface ICommunicationLog extends Document {
  userId: mongoose.Types.ObjectId;
  leadId: mongoose.Types.ObjectId;
  channel: string;
  direction: string;
  subject?: string;
  message: string;
  status: string;
  providerId?: string;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  repliedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CommunicationLogSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true },
    channel: { type: String, enum: ['whatsapp', 'email', 'call', 'sms', 'manual'], required: true },
    direction: { type: String, enum: ['outbound', 'inbound'], required: true },
    subject: { type: String },
    message: { type: String, required: true },
    status: { type: String, enum: ['pending', 'sent', 'delivered', 'read', 'replied', 'failed'], default: 'sent' },
    providerId: { type: String },
    sentAt: { type: Date, default: Date.now },
    deliveredAt: { type: Date },
    readAt: { type: Date },
    repliedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<ICommunicationLog>('CommunicationLog', CommunicationLogSchema);
