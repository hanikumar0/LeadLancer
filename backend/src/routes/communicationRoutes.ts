import express from 'express';
import { generateWhatsAppLink, logCommunication, getLeadCommunications } from '../controllers/communicationController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/whatsapp/link', protect, generateWhatsAppLink);
router.post('/', protect, logCommunication);
router.get('/:leadId', protect, getLeadCommunications);

export default router;
