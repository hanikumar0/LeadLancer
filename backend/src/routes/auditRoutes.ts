import express from 'express';
import { startAudit, startBulkAudit, getTopLeads, getLeadReport } from '../controllers/auditController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/run/:leadId', protect, startAudit);
router.post('/run-bulk', protect, startBulkAudit);
router.get('/top', protect, getTopLeads);
router.get('/:id/report', protect, getLeadReport);

export default router;
