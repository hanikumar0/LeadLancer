import mongoose from 'mongoose';
import ScheduledTask from '../models/ScheduledTask';
import AutomationRule from '../models/AutomationRule';
import AIRecommendation from '../models/AIRecommendation';
import Lead from '../models/Lead';
import { generateAiEmail } from './aiService';

export const createScheduledTask = async (userId: string, type: string, payload: any, runAt: Date) => {
  return await ScheduledTask.create({
    userId,
    type,
    payload,
    runAt
  });
};

export const createAutomationRule = async (userId: string, data: any) => {
  return await AutomationRule.create({ userId, ...data });
};

export const getAutomationDashboard = async (userId: string) => {
  const rules = await AutomationRule.find({ userId });
  const tasks = await ScheduledTask.find({ userId, status: { $in: ['pending', 'processing'] } }).sort({ runAt: 1 });
  const recommendations = await AIRecommendation.find({ userId, isDismissed: false });
  
  // Create an AI recommendation on the fly if none exist
  if (recommendations.length === 0) {
    const aiRec = await AIRecommendation.create({
      userId,
      category: 'outreach',
      title: 'Follow up with Hot Leads',
      description: 'You have 3 leads with a score > 80 that have not replied in 3 days. Send a quick WhatsApp ping.',
      priority: 'high'
    });
    recommendations.push(aiRec);
  }

  return { rules, tasks, recommendations };
};

export const dismissRecommendation = async (id: string, userId: string) => {
  return await AIRecommendation.findOneAndUpdate({ _id: id, userId }, { isDismissed: true });
};
