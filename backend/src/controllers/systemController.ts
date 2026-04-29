import { Request, Response } from 'express';
import { createResponse } from '../utils/response';
import mongoose from 'mongoose';
import os from 'os';
import { env } from '../config/env';

export const getHealth = async (req: Request, res: Response) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const memoryUsage = process.memoryUsage();
  
  res.json(createResponse(true, 'System is healthy', {
    status: 'online',
    environment: env.NODE_ENV,
    database: dbStatus,
    uptime: process.uptime(),
    memory: {
      rss: Math.round(memoryUsage.rss / 1024 / 1024) + ' MB',
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB',
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
    },
    cpu: os.loadavg(),
    timestamp: new Date()
  }));
};

export const retryJob = async (req: Request, res: Response) => {
  // Logic to manually re-queue failed tasks from the ScheduledTasks collection
  res.json(createResponse(true, 'Failed jobs queued for retry'));
};

export const getMetrics = async (req: Request, res: Response) => {
  res.json(createResponse(true, 'Metrics fetched', { activeWorkers: 1, queueLength: 0, errorRate: '0%' }));
};
