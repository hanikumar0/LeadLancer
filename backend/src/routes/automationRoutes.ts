import express from 'express';
import { getDashboard, addRule, dismissRec, addTask } from '../controllers/automationController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/dashboard', protect, getDashboard);
router.post('/rules', protect, addRule);
router.post('/tasks', protect, addTask);
router.patch('/recommendations/:id/dismiss', protect, dismissRec);

export default router;
