import { Queue, QueueOptions } from "bullmq";

// Manages job queueing and status tracking
import { Injectable } from "@nestjs/common";
import type { JobType } from "bullmq";

const queueOptions: QueueOptions = {
  connection: {
    host: "localhost",
    port: 6379,
  },
};

@Injectable()
export class QueueService {
  private videoQueue: Queue;

  constructor() {
    this.videoQueue = new Queue("video-processing", queueOptions);
  }

  async addJob(uuid: string, filepath: string) {
    await this.videoQueue.add("process-video", { uuid, filepath });
  }

  /**
   * Get the status and metadata of a job by UUID.
   * Searches all job states for a job with the given UUID in its data.
   */
  async getJobStatusByUuid(uuid: string) {
    // Search in all possible job states
    const states: JobType[] = [
      "completed",
      "failed",
      "delayed",
      "active",
      "waiting",
      "waiting-children",
      "prioritized",
      "paused",
    ];
    for (const state of states) {
      // Get up to 100 jobs per state (can be increased if needed)
      const jobs = await this.videoQueue.getJobs([state], 0, 100, true);
      const job = jobs.find((j) => j.data && j.data.uuid === uuid);
      if (job) {
        return {
          status: state,
          jobId: job.id,
          uuid: job.data.uuid,
          createdAt: job.timestamp,
          finishedAt: job.finishedOn,
          failedReason: job.failedReason,
          returnValue: job.returnvalue,
        };
      }
    }
    // Not found
    return null;
  }
}
