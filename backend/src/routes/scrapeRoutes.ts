import express from 'express';
import { startScrape, getJobs } from '../controllers/scrapeController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/start', protect, startScrape);
router.get('/jobs', protect, getJobs);

export default router;
