import { Request, Response } from 'express';
import { getAutomationDashboard, createAutomationRule, dismissRecommendation, createScheduledTask } from '../services/automationService';
import { AuthRequest } from '../middleware/auth';
import { createResponse } from '../utils/response';

export const getDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const dashboard = await getAutomationDashboard(req.user._id.toString());
    res.json(createResponse(true, 'Automation dashboard fetched', dashboard));
  } catch (error) {
    res.status(500).json(createResponse(false, 'Failed to fetch automation dashboard'));
  }
};

export const addRule = async (req: AuthRequest, res: Response) => {
  try {
    const rule = await createAutomationRule(req.user._id.toString(), req.body);
    res.status(201).json(createResponse(true, 'Rule created', rule));
  } catch (error) {
    res.status(500).json(createResponse(false, 'Failed to create rule'));
  }
};

export const addTask = async (req: AuthRequest, res: Response) => {
  try {
    const { type, payload, runAt } = req.body;
    const task = await createScheduledTask(req.user._id.toString(), type, payload, new Date(runAt));
    res.status(201).json(createResponse(true, 'Task scheduled', task));
  } catch (error) {
    res.status(500).json(createResponse(false, 'Failed to schedule task'));
  }
};

export const dismissRec = async (req: AuthRequest, res: Response) => {
  try {
    await dismissRecommendation(req.params.id, req.user._id.toString());
    res.json(createResponse(true, 'Recommendation dismissed'));
  } catch (error) {
    res.status(500).json(createResponse(false, 'Failed to dismiss recommendation'));
  }
};
