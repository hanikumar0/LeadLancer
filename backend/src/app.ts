import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import scrapeRoutes from './routes/scrapeRoutes';
import leadRoutes from './routes/leadRoutes';
import auditRoutes from './routes/auditRoutes';
import outreachRoutes from './routes/outreachRoutes';
import crmRoutes from './routes/crmRoutes';
import { errorHandler } from './middleware/error';

dotenv.config();

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
});
app.use('/api/', limiter);

// Body parser
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/scrape', scrapeRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/outreach', outreachRoutes);
app.use('/api/crm', crmRoutes);

// Error Handler
app.use(errorHandler);

export default app;
