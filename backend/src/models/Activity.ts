import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity extends Document {
  userId: mongoose.Types.ObjectId;
  leadId: mongoose.Types.ObjectId;
  dealId?: mongoose.Types.ObjectId;
  type: string;
  message: string;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true },
    dealId: { type: Schema.Types.ObjectId, ref: 'Deal' },
    type: { type: String, enum: ['note', 'email', 'call', 'meeting', 'status_change', 'audit', 'deal_created'], required: true },
    message: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default mongoose.model<IActivity>('Activity', ActivitySchema);
