import mongoose, { Document, Schema } from 'mongoose';

export interface ITemplate extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  category: string;
  subject: string;
  body: string;
  tone: string;
  createdAt: Date;
  updatedAt: Date;
}

const TemplateSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    tone: { type: String, default: 'Professional' },
  },
  { timestamps: true }
);

export default mongoose.model<ITemplate>('Template', TemplateSchema);
