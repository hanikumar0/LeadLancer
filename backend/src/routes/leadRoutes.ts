import express from 'express';
import { getLeads, updateLead, deleteLead } from '../controllers/leadController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', protect, getLeads);
router.patch('/:id', protect, updateLead);
router.delete('/:id', protect, deleteLead);

export default router;
