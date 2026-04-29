import express from 'express';
import { 
  updateLeadStage, 
  createDeal, getDeals, updateDealStatus, 
  createMeeting, getMeetings, 
  addNote, getLeadActivities, 
  getCrmStats 
} from '../controllers/crmController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.patch('/leads/:id/stage', protect, updateLeadStage);

router.post('/deals', protect, createDeal);
router.get('/deals', protect, getDeals);
router.patch('/deals/:id/status', protect, updateDealStatus);

router.post('/meetings', protect, createMeeting);
router.get('/meetings', protect, getMeetings);

router.post('/notes', protect, addNote);
router.get('/notes/:leadId', protect, getLeadActivities);

router.get('/stats', protect, getCrmStats);

export default router;
