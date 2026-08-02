import { db } from '../database.js';
import { generateReport } from '../reportGenerator.js';
import { reportQueue } from '../reportQueue.js';

reportQueue.process(async (message) => {
  const { jobId, studentId } = message;

  try {
    // 1. Update status to processing
    await db.updateReportJob(jobId, {
      status: 'processing'
    });

    // 2. Generate the report
    const downloadUrl = await generateReport(studentId);

    // 3. Mark as completed and store download URL
    await db.updateReportJob(jobId, {
      status: 'completed',
      downloadUrl: downloadUrl
    });
  } catch (error) {
    // 4. Catch errors and mark job as failed without crashing worker
    await db.updateReportJob(jobId, {
      status: 'failed'
    });
  }
});