import mongoose, { Document, Schema } from 'mongoose';

export interface IAutomationRule extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  type: string;
  trigger: string;
  conditions: any;
  actions: any;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AutomationRuleSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['scrape', 'follow_up', 'scoring', 'notification'], required: true },
    trigger: { type: String, required: true }, // e.g. "schedule", "on_lead_added", "on_reply"
    conditions: { type: Schema.Types.Mixed, default: {} }, // e.g. { scoreGt: 80, daysNoReply: 3 }
    actions: { type: Schema.Types.Mixed, required: true }, // e.g. { type: 'send_email', templateId: '...' }
    isEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IAutomationRule>('AutomationRule', AutomationRuleSchema);
