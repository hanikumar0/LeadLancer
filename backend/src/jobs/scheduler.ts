import cron from 'node-cron';
import ScheduledTask from '../models/ScheduledTask';
import Activity from '../models/Activity';

export const startScheduler = () => {
  // Run every minute
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      
      // Find all pending tasks that should be run now
      const tasksToRun = await ScheduledTask.find({
        status: 'pending',
        runAt: { $lte: now }
      });

      for (const task of tasksToRun) {
        // Mark as processing
        task.status = 'processing';
        task.lastRunAt = now;
        task.attempts += 1;
        await task.save();

        try {
          // Task Executor Logic
          if (task.type === 'email') {
            console.log(`[Job] Executing email task for user ${task.userId}`);
            // Logic to send email would go here...
          } else if (task.type === 'reminder') {
            console.log(`[Job] Executing reminder task for user ${task.userId}`);
            // Log a reminder activity
            await Activity.create({
              userId: task.userId,
              leadId: task.payload.leadId,
              type: 'note',
              message: `[AUTOMATION] Follow up reminder: ${task.payload.message || 'Time to follow up!'}`
            });
          }

          // Mark completed
          task.status = 'completed';
          await task.save();
        } catch (jobError: any) {
          task.status = 'failed';
          task.errorMessage = jobError.message;
          await task.save();
        }
      }
    } catch (error) {
      console.error('Scheduler Error:', error);
    }
  });
  
  console.log('Task Scheduler initialized and running...');
};
