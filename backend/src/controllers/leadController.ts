import { Request, Response } from 'express';
import Lead from '../models/Lead';
import { AuthRequest } from '../middleware/auth';
import { createResponse } from '../utils/response';

export const getLeads = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 50, search = '', status, city, niche } = req.query;
    
    const query: any = { userId: req.user._id };
    
    if (search) {
      query.businessName = { $regex: search, $options: 'i' };
    }
    if (status) query.status = status;
    if (city) query.city = { $regex: city, $options: 'i' };
    if (niche) query.niche = { $regex: niche, $options: 'i' };

    const skip = (Number(page) - 1) * Number(limit);
    
    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
      
    const total = await Lead.countDocuments(query);

    res.json(createResponse(true, 'Leads fetched', {
      leads,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    }));
  } catch (error) {
    res.status(500).json(createResponse(false, 'Failed to fetch leads'));
  }
};

export const updateLead = async (req: AuthRequest, res: Response) => {
  try {
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!lead) return res.status(404).json(createResponse(false, 'Lead not found'));
    res.json(createResponse(true, 'Lead updated', lead));
  } catch (error) {
    res.status(500).json(createResponse(false, 'Failed to update lead'));
  }
};

export const deleteLead = async (req: AuthRequest, res: Response) => {
  try {
    const lead = await Lead.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!lead) return res.status(404).json(createResponse(false, 'Lead not found'));
    res.json(createResponse(true, 'Lead deleted'));
  } catch (error) {
    res.status(500).json(createResponse(false, 'Failed to delete lead'));
  }
};
