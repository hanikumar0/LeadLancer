import { Request, Response } from 'express';
import Notification from '../models/Notification';
import { AuthRequest } from '../middleware/auth';
import { createResponse } from '../utils/response';

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(createResponse(true, 'Notifications fetched', notifications));
  } catch (error) {
    res.status(500).json(createResponse(false, 'Failed to fetch notifications'));
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true }
    );
    res.json(createResponse(true, 'Notification marked as read'));
  } catch (error) {
    res.status(500).json(createResponse(false, 'Failed to mark as read'));
  }
};

export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true }
    );
    res.json(createResponse(true, 'All notifications marked as read'));
  } catch (error) {
    res.status(500).json(createResponse(false, 'Failed to mark all as read'));
  }
};
