import { Request, Response } from 'express';
import Lead from '../models/Lead';
import CommunicationLog from '../models/CommunicationLog';
import Activity from '../models/Activity';
import { AuthRequest } from '../middleware/auth';
import { createResponse } from '../utils/response';

export const generateWhatsAppLink = async (req: AuthRequest, res: Response) => {
  try {
    const { leadId, messageTemplate } = req.body;
    
    const lead = await Lead.findOne({ _id: leadId, userId: req.user._id });
    if (!lead) return res.status(404).json(createResponse(false, 'Lead not found'));

    let phone = lead.whatsappNumber || lead.phone;
    if (!phone) return res.status(400).json(createResponse(false, 'Lead has no phone number'));

    // Clean phone number
    phone = phone.replace(/[^0-9]/g, '');

    // Format message
    let message = messageTemplate || 'Hi {{businessName}}, open to a quick chat about your website?';
    message = message.replace('{{businessName}}', lead.businessName);
    message = message.replace('{{city}}', lead.city);
    message = message.replace('{{issue}}', lead.issues?.[0] || 'your website design');
    message = message.replace('{{service}}', lead.bestServiceToSell || 'marketing');

    const encodedMessage = encodeURIComponent(message);
    const link = `https://wa.me/${phone}?text=${encodedMessage}`;

    res.json(createResponse(true, 'WhatsApp link generated', { link, message, phone }));
  } catch (error) {
    res.status(500).json(createResponse(false, 'Failed to generate link'));
  }
};

export const logCommunication = async (req: AuthRequest, res: Response) => {
  try {
    const { leadId, channel, direction, message } = req.body;
    
    const log = await CommunicationLog.create({
      userId: req.user._id,
      leadId,
      channel,
      direction,
      message,
      status: 'sent'
    });

    await Activity.create({
      userId: req.user._id,
      leadId,
      type: channel,
      message: `${direction === 'outbound' ? 'Sent' : 'Received'} ${channel} message`
    });

    await Lead.findByIdAndUpdate(leadId, {
      lastMessageAt: new Date(),
      lastContactedAt: direction === 'outbound' ? new Date() : undefined,
      $inc: { communicationCount: 1 },
      crmStage: 'Contacted',
      isContacted: true
    });

    res.status(201).json(createResponse(true, 'Communication logged', log));
  } catch (error) {
    res.status(500).json(createResponse(false, 'Failed to log communication'));
  }
};

export const getLeadCommunications = async (req: AuthRequest, res: Response) => {
  try {
    const logs = await CommunicationLog.find({ leadId: req.params.leadId, userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(createResponse(true, 'Communications fetched', logs));
  } catch (error) {
    res.status(500).json(createResponse(false, 'Failed to fetch communications'));
  }
};
