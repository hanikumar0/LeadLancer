import { Request, Response } from 'express';
import { sendSingleEmail } from '../services/emailService';
import { generateAiEmail as generateAiEmailService } from '../services/aiService';
import Lead from '../models/Lead';
import OutreachLog from '../models/OutreachLog';
import { AuthRequest } from '../middleware/auth';
import { createResponse } from '../utils/response';

export const sendEmail = async (req: AuthRequest, res: Response) => {
  try {
    const { leadId, subject, body } = req.body;
    
    if (!leadId || !subject || !body) {
      return res.status(400).json(createResponse(false, 'Missing required fields'));
    }

    const lead = await Lead.findOne({ _id: leadId, userId: req.user._id });
    if (!lead || !lead.email) {
      return res.status(400).json(createResponse(false, 'Lead not found or missing email'));
    }

    const result = await sendSingleEmail(
      req.user._id as string,
      lead._id.toString(),
      lead.email,
      subject,
      body
    );

    if (result.success) {
      // Update lead status
      lead.status = 'Contacted';
      lead.isContacted = true;
      await lead.save();
      return res.json(createResponse(true, 'Email sent successfully'));
    } else {
      return res.status(500).json(createResponse(false, 'Failed to send email', result.error));
    }
  } catch (error) {
    res.status(500).json(createResponse(false, 'Server error during email send'));
  }
};

export const generateAiEmail = async (req: AuthRequest, res: Response) => {
  try {
    const { leadId, tone = 'Professional' } = req.body;
    
    const lead = await Lead.findOne({ _id: leadId, userId: req.user._id });
    if (!lead) return res.status(404).json(createResponse(false, 'Lead not found'));

    const aiEmail = await generateAiEmailService({
      leadBusinessName: lead.businessName,
      niche: lead.niche,
      city: lead.city,
      issues: lead.issues || [],
      bestService: lead.bestServiceToSell || 'Digital Marketing'
    });

    res.json(createResponse(true, 'AI Email generated', aiEmail));
  } catch (error) {
    res.status(500).json(createResponse(false, 'Failed to generate AI email'));
  }
};

export const getOutreachLogs = async (req: AuthRequest, res: Response) => {
  try {
    const logs = await OutreachLog.find({ userId: req.user._id })
      .populate('leadId', 'businessName email')
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json(createResponse(true, 'Logs fetched', logs));
  } catch (error) {
    res.status(500).json(createResponse(false, 'Failed to fetch logs'));
  }
};
