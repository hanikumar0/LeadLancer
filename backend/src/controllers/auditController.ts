import { Request, Response } from 'express';
import { runAudit } from '../services/auditService';
import Lead from '../models/Lead';
import { AuthRequest } from '../middleware/auth';
import { createResponse } from '../utils/response';

export const startAudit = async (req: AuthRequest, res: Response) => {
  try {
    const { leadId } = req.params;
    
    // Ensure lead belongs to user
    const lead = await Lead.findOne({ _id: leadId, userId: req.user._id });
    if (!lead) return res.status(404).json(createResponse(false, 'Lead not found'));

    // Start background audit
    runAudit(leadId as string).catch(console.error);

    res.status(202).json(createResponse(true, 'Audit queued successfully'));
  } catch (error) {
    res.status(500).json(createResponse(false, 'Failed to start audit'));
  }
};

export const startBulkAudit = async (req: AuthRequest, res: Response) => {
  try {
    // Find up to 10 pending leads for this user that haven't been audited in 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const leads = await Lead.find({ 
      userId: req.user._id,
      $or: [
        { auditStatus: 'pending' },
        { lastAuditedAt: { $lt: sevenDaysAgo } }
      ]
    }).limit(5); // Limit to 5 for safety

    if (leads.length === 0) {
      return res.json(createResponse(true, 'No leads require auditing at this time'));
    }

    leads.forEach(lead => {
      runAudit(lead._id.toString()).catch(console.error);
    });

    res.status(202).json(createResponse(true, `Queued ${leads.length} leads for auditing`));
  } catch (error) {
    res.status(500).json(createResponse(false, 'Failed to start bulk audit'));
  }
};

export const getTopLeads = async (req: AuthRequest, res: Response) => {
  try {
    const { scoreMin = 70, city, niche, limit = 10 } = req.query;
    
    const query: any = { 
      userId: req.user._id,
      totalLeadScore: { $gte: Number(scoreMin) }
    };
    
    if (city) query.city = { $regex: city, $options: 'i' };
    if (niche) query.niche = { $regex: niche, $options: 'i' };

    const leads = await Lead.find(query)
      .sort({ totalLeadScore: -1 })
      .limit(Number(limit));

    res.json(createResponse(true, 'Top leads fetched', leads));
  } catch (error) {
    res.status(500).json(createResponse(false, 'Failed to fetch top leads'));
  }
};

export const getLeadReport = async (req: AuthRequest, res: Response) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, userId: req.user._id });
    if (!lead) return res.status(404).json(createResponse(false, 'Lead not found'));
    
    res.json(createResponse(true, 'Lead report fetched', lead));
  } catch (error) {
    res.status(500).json(createResponse(false, 'Failed to fetch lead report'));
  }
};
