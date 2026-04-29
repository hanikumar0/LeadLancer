import app from './app';
import { connectDB } from './config/db';
import { startScheduler } from './jobs/scheduler';

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  startScheduler();
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
});
