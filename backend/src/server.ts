import app from './app';
import { connectDB } from './config/db';
import { startScheduler } from './jobs/scheduler';
import { env } from './config/env';

const PORT = env.PORT || 5000;

connectDB().then(() => {
  startScheduler();
  app.listen(PORT, () => {
    console.log(`Server running in ${env.NODE_ENV} mode on port ${PORT}`);
  });
});
