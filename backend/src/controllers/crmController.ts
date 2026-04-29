import { Request, Response } from 'express';
import Deal from '../models/Deal';
import Meeting from '../models/Meeting';
import Activity from '../models/Activity';
import Lead from '../models/Lead';
import { AuthRequest } from '../middleware/auth';
import { createResponse } from '../utils/response';

// --- LEADS ---
export const updateLeadStage = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { crmStage } = req.body;
    
    const lead = await Lead.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { crmStage },
      { new: true }
    );
    
    if (!lead) return res.status(404).json(createResponse(false, 'Lead not found'));
    
    // Log activity
    await Activity.create({ userId: req.user._id, leadId: lead._id, type: 'status_change', message: `Stage changed to ${crmStage}` });
    
    res.json(createResponse(true, 'Stage updated', lead));
  } catch (error) {
    res.status(500).json(createResponse(false, 'Failed to update stage'));
  }
};

// --- DEALS ---
export const createDeal = async (req: AuthRequest, res: Response) => {
  try {
    const deal = await Deal.create({ ...req.body, userId: req.user._id });
    await Activity.create({ userId: req.user._id, leadId: deal.leadId, dealId: deal._id, type: 'deal_created', message: `Deal "${deal.title}" created for $${deal.value}` });
    
    // Update lead dealValue
    await Lead.findByIdAndUpdate(deal.leadId, { dealValue: deal.value, crmStage: 'Qualified' });
    
    res.status(201).json(createResponse(true, 'Deal created', deal));
  } catch (error) {
    res.status(500).json(createResponse(false, 'Failed to create deal'));
  }
};

export const getDeals = async (req: AuthRequest, res: Response) => {
  try {
    const deals = await Deal.find({ userId: req.user._id }).populate('leadId', 'businessName');
    res.json(createResponse(true, 'Deals fetched', deals));
  } catch (error) {
    res.status(500).json(createResponse(false, 'Failed to fetch deals'));
  }
};

export const updateDealStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status, stage } = req.body;
    const deal = await Deal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { status, stage },
      { new: true }
    );
    if (!deal) return res.status(404).json(createResponse(false, 'Deal not found'));
    
    await Activity.create({ userId: req.user._id, leadId: deal.leadId, dealId: deal._id, type: 'status_change', message: `Deal moved to ${stage} (${status})` });
    res.json(createResponse(true, 'Deal updated', deal));
  } catch (error) {
    res.status(500).json(createResponse(false, 'Failed to update deal'));
  }
};

// --- MEETINGS ---
export const createMeeting = async (req: AuthRequest, res: Response) => {
  try {
    const meeting = await Meeting.create({ ...req.body, userId: req.user._id });
    await Activity.create({ userId: req.user._id, leadId: meeting.leadId, dealId: meeting.dealId, type: 'meeting', message: `Meeting "${meeting.title}" scheduled` });
    res.status(201).json(createResponse(true, 'Meeting scheduled', meeting));
  } catch (error) {
    res.status(500).json(createResponse(false, 'Failed to schedule meeting'));
  }
};

export const getMeetings = async (req: AuthRequest, res: Response) => {
  try {
    const meetings = await Meeting.find({ userId: req.user._id }).populate('leadId', 'businessName').sort({ startTime: 1 });
    res.json(createResponse(true, 'Meetings fetched', meetings));
  } catch (error) {
    res.status(500).json(createResponse(false, 'Failed to fetch meetings'));
  }
};

// --- NOTES/ACTIVITY ---
export const addNote = async (req: AuthRequest, res: Response) => {
  try {
    const { leadId, message } = req.body;
    const activity = await Activity.create({ userId: req.user._id, leadId, type: 'note', message });
    res.status(201).json(createResponse(true, 'Note added', activity));
  } catch (error) {
    res.status(500).json(createResponse(false, 'Failed to add note'));
  }
};

export const getLeadActivities = async (req: AuthRequest, res: Response) => {
  try {
    const activities = await Activity.find({ leadId: req.params.leadId, userId: req.user._id }).sort({ createdAt: -1 });
    res.json(createResponse(true, 'Activities fetched', activities));
  } catch (error) {
    res.status(500).json(createResponse(false, 'Failed to fetch activities'));
  }
};

// --- DASHBOARD ---
export const getCrmStats = async (req: AuthRequest, res: Response) => {
  try {
    const deals = await Deal.find({ userId: req.user._id });
    const pipelineValue = deals.filter(d => d.status === 'open').reduce((sum, d) => sum + d.value, 0);
    const wonValue = deals.filter(d => d.status === 'won').reduce((sum, d) => sum + d.value, 0);
    const lostValue = deals.filter(d => d.status === 'lost').reduce((sum, d) => sum + d.value, 0);
    
    res.json(createResponse(true, 'Stats fetched', {
      pipelineValue, wonValue, lostValue, totalDeals: deals.length, openDeals: deals.filter(d => d.status === 'open').length
    }));
  } catch (error) {
    res.status(500).json(createResponse(false, 'Failed to fetch stats'));
  }
};
