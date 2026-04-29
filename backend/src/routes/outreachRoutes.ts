import express from 'express';
import { sendEmail, generateAiEmail, getOutreachLogs } from '../controllers/outreachController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/send', protect, sendEmail);
router.post('/ai/generate', protect, generateAiEmail);
router.get('/logs', protect, getOutreachLogs);

export default router;
