import express from 'express';
import { getHealth, getMetrics, retryJob } from '../controllers/systemController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/health', protect, getHealth);
router.get('/metrics', protect, getMetrics);
router.post('/retry-job', protect, retryJob);

export default router;
