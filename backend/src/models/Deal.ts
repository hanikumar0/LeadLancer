import mongoose, { Document, Schema } from 'mongoose';

export interface IDeal extends Document {
  userId: mongoose.Types.ObjectId;
  leadId: mongoose.Types.ObjectId;
  title: string;
  serviceType: string;
  value: number;
  currency: string;
  probability: number;
  expectedCloseDate?: Date;
  status: string;
  stage: string;
  source: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DealSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    leadId: { type: Schema.Types.ObjectId, ref: 'Lead', required: true },
    title: { type: String, required: true },
    serviceType: { type: String, required: true },
    value: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    probability: { type: Number, min: 0, max: 100, default: 10 },
    expectedCloseDate: { type: Date },
    status: { type: String, enum: ['open', 'won', 'lost'], default: 'open' },
    stage: { 
      type: String, 
      enum: ['Qualified', 'Meeting Booked', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'],
      default: 'Qualified'
    },
    source: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IDeal>('Deal', DealSchema);
