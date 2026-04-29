import mongoose from 'mongoose';
import Lead from '../models/Lead';
import Deal from '../models/Deal';
import CommunicationLog from '../models/CommunicationLog';
import Activity from '../models/Activity';
import Meeting from '../models/Meeting';

export const getKpis = async (userId: mongoose.Types.ObjectId) => {
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  // Leads KPIs
  const totalLeads = await Lead.countDocuments({ userId });
  const newLeadsMonth = await Lead.countDocuments({ userId, createdAt: { $gte: startOfMonth } });
  const hotLeads = await Lead.countDocuments({ userId, totalLeadScore: { $gte: 80 } });
  
  // Deals & Revenue
  const deals = await Deal.find({ userId });
  const pipelineValue = deals.filter(d => d.status === 'open').reduce((sum, d) => sum + d.value, 0);
  const wonDeals = deals.filter(d => d.status === 'won');
  const wonRevenue = wonDeals.reduce((sum, d) => sum + d.value, 0);
  const winRate = deals.length > 0 ? Math.round((wonDeals.length / deals.length) * 100) : 0;

  // Outreach KPIs
  const outbox = await CommunicationLog.countDocuments({ userId, direction: 'outbound' });
  const replies = await CommunicationLog.countDocuments({ userId, direction: 'inbound' });
  const replyRate = outbox > 0 ? Math.round((replies / outbox) * 100) : 0;

  // Meetings
  const meetingsBooked = await Meeting.countDocuments({ userId, createdAt: { $gte: startOfMonth } });

  return {
    totalLeads,
    newLeadsMonth,
    hotLeads,
    pipelineValue,
    wonRevenue,
    winRate,
    outbox,
    replyRate,
    meetingsBooked
  };
};

export const getTrends = async (userId: mongoose.Types.ObjectId) => {
  // Aggregation for Outreach by Channel
  const channelData = await CommunicationLog.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId.toString()), direction: 'outbound' } },
    { $group: { _id: '$channel', count: { $sum: 1 } } }
  ]);

  // Lead Funnel
  const funnelData = await Lead.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId.toString()) } },
    { $group: { _id: '$crmStage', value: { $sum: 1 } } }
  ]);

  // Aggregation for Niche Performance (Won Deals)
  const nicheData = await Deal.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId.toString()), status: 'won' } },
    {
      $lookup: {
        from: 'leads',
        localField: 'leadId',
        foreignField: '_id',
        as: 'lead'
      }
    },
    { $unwind: '$lead' },
    { $group: { _id: '$lead.niche', revenue: { $sum: '$value' } } },
    { $sort: { revenue: -1 } },
    { $limit: 5 }
  ]);

  return {
    channels: channelData.map(c => ({ name: c._id, value: c.count })),
    funnel: funnelData.map(f => ({ name: f._id, value: f.value })),
    niches: nicheData.map(n => ({ name: n._id || 'Unknown', value: n.revenue }))
  };
};

export const getInsights = async (userId: mongoose.Types.ObjectId) => {
  const kpis = await getKpis(userId);
  const insights = [];

  if (kpis.hotLeads > 10) {
    insights.push({ type: 'warning', text: `You have ${kpis.hotLeads} hot leads waiting. Time to follow up!` });
  }

  if (kpis.replyRate < 10 && kpis.outbox > 50) {
    insights.push({ type: 'danger', text: `Your reply rate is low (${kpis.replyRate}%). Try regenerating your AI pitches or changing your tone.` });
  } else if (kpis.replyRate > 20) {
    insights.push({ type: 'success', text: `Great engagement! Your reply rate is ${kpis.replyRate}%. Keep up the current outreach strategy.` });
  }

  if (kpis.pipelineValue > kpis.wonRevenue && kpis.pipelineValue > 1000) {
    insights.push({ type: 'info', text: `You have $${kpis.pipelineValue} sitting in the pipeline. Focus on closing active negotiations this week.` });
  }

  return insights;
};

export const getProductivityScore = async (userId: mongoose.Types.ObjectId) => {
  const today = new Date();
  today.setHours(0,0,0,0);

  const activitiesToday = await Activity.countDocuments({ userId, createdAt: { $gte: today } });
  const communicationsToday = await CommunicationLog.countDocuments({ userId, createdAt: { $gte: today }, direction: 'outbound' });
  const meetingsToday = await Meeting.countDocuments({ userId, startTime: { $gte: today } });

  // Simple weighted score algorithm (Max 100)
  let score = 0;
  score += Math.min(activitiesToday * 2, 30); // Max 30 points from CRM activity
  score += Math.min(communicationsToday * 5, 40); // Max 40 points from Outreach
  score += Math.min(meetingsToday * 15, 30); // Max 30 points from Meetings
  
  return Math.min(100, score);
};
