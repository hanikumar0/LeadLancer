import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import mongoSanitize from 'express-mongo-sanitize';
import authRoutes from './routes/authRoutes';
import scrapeRoutes from './routes/scrapeRoutes';
import leadRoutes from './routes/leadRoutes';
import auditRoutes from './routes/auditRoutes';
import outreachRoutes from './routes/outreachRoutes';
import crmRoutes from './routes/crmRoutes';
import communicationRoutes from './routes/communicationRoutes';
import notificationRoutes from './routes/notificationRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import automationRoutes from './routes/automationRoutes';
import systemRoutes from './routes/systemRoutes';
import { errorHandler } from './middleware/error';

const app = express();

// Security Middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(cors({ origin: env.CLIENT_URL || '*' }));

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
app.use('/api/communications', communicationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/automations', automationRoutes);
app.use('/api/system', systemRoutes);

// Error Handler
app.use(errorHandler);

export default app;
