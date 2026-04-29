import mongoose, { Document, Schema } from 'mongoose';

export interface ILead extends Document {
  userId: mongoose.Types.ObjectId;
  businessName: string;
  ownerName?: string;
  email?: string;
  phone?: string;
  website?: string;
  city: string;
  state?: string;
  country?: string;
  niche: string;
  source: string;
  sourceUrl?: string;
  score: number;
  status: string;
  tags: string[];
  notes?: string;
  isContacted: boolean;
  auditStatus: string;
  websiteHealthScore: number;
  seoScore: number;
  uiScore: number;
  performanceScore: number;
  trustScore: number;
  buyIntentScore: number;
  totalLeadScore: number;
  websiteTechStack: string[];
  issues: string[];
  opportunities: string[];
  auditSummary?: string;
  recommendedPitch?: string;
  bestServiceToSell?: string;
  lastAuditedAt?: Date;
  crmStage: string;
  lastContactedAt?: Date;
  nextFollowUpAt?: Date;
  dealValue?: number;
  ownerStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    businessName: { type: String, required: true },
    ownerName: { type: String },
    email: { type: String },
    phone: { type: String },
    website: { type: String },
    city: { type: String, required: true },
    state: { type: String },
    country: { type: String },
    niche: { type: String, required: true },
    source: { type: String, required: true },
    sourceUrl: { type: String },
    score: { type: Number, default: 0 },
    status: { 
      type: String, 
      enum: ['New', 'Reviewed', 'Contacted', 'Interested', 'Closed', 'Ignored'],
      default: 'New' 
    },
    tags: [{ type: String }],
    notes: { type: String },
    isContacted: { type: Boolean, default: false },
    auditStatus: { type: String, enum: ['pending', 'running', 'completed', 'failed'], default: 'pending' },
    websiteHealthScore: { type: Number, default: 0 },
    seoScore: { type: Number, default: 0 },
    uiScore: { type: Number, default: 0 },
    performanceScore: { type: Number, default: 0 },
    trustScore: { type: Number, default: 0 },
    buyIntentScore: { type: Number, default: 0 },
    totalLeadScore: { type: Number, default: 0 },
    websiteTechStack: [{ type: String }],
    issues: [{ type: String }],
    opportunities: [{ type: String }],
    auditSummary: { type: String },
    recommendedPitch: { type: String },
    bestServiceToSell: { type: String },
    lastAuditedAt: { type: Date },
    crmStage: { 
      type: String, 
      enum: ['New Lead', 'Contacted', 'Replied', 'Qualified', 'Meeting Booked', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'],
      default: 'New Lead' 
    },
    lastContactedAt: { type: Date },
    nextFollowUpAt: { type: Date },
    dealValue: { type: Number },
    ownerStatus: { type: String, default: 'active' },
  },
  { timestamps: true }
);

// Prevent duplicates: same business in same city, or same phone/website
LeadSchema.index({ businessName: 1, city: 1 }, { unique: true });
LeadSchema.index({ phone: 1 }, { unique: true, partialFilterExpression: { phone: { $type: "string" } } });
LeadSchema.index({ website: 1 }, { unique: true, partialFilterExpression: { website: { $type: "string" } } });

export default mongoose.model<ILead>('Lead', LeadSchema);
