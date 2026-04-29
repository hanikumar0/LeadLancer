import { Request, Response } from 'express';
import { getKpis, getTrends, getInsights, getProductivityScore } from '../services/analyticsService';
import { AuthRequest } from '../middleware/auth';
import { createResponse } from '../utils/response';
import mongoose from 'mongoose';

export const getOverview = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id as mongoose.Types.ObjectId;
    
    const [kpis, trends, insights, productivityScore] = await Promise.all([
      getKpis(userId),
      getTrends(userId),
      getInsights(userId),
      getProductivityScore(userId)
    ]);

    res.json(createResponse(true, 'Analytics fetched', {
      kpis,
      trends,
      insights,
      productivityScore
    }));
  } catch (error) {
    console.error('Analytics Error:', error);
    res.status(500).json(createResponse(false, 'Failed to fetch analytics'));
  }
};
