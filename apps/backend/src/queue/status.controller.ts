import { Controller, Get, Param, NotFoundException } from "@nestjs/common";
import { QueueService } from "./queue.service";
import Redis from "ioredis";

@Controller("status")
export class StatusController {
  private readonly redis = new Redis({ host: "localhost", port: 6379 });
  constructor(private readonly queueService: QueueService) {}

  @Get(":uuid")
  async getStatus(@Param("uuid") uuid: string) {
    const job = await this.queueService.getJobStatusByUuid(uuid);
    if (!job) {
      throw new NotFoundException("Job not found");
    }
    // Fetch event log from Redis
    let events: any[] = [];
    try {
      const rawEvents = await this.redis.lrange(`job:events:${uuid}`, 0, -1);
      events = rawEvents.map((e) => JSON.parse(e));
    } catch (e) {
      events = [];
    }
    // If job is completed, return processing_completed and videoUrl
    if (job.status === "completed") {
      // Assume videoUrl follows the pattern used in emitProcessingCompleted
      return {
        ...job,
        status: "processing_completed",
        videoUrl: `/videos/${uuid}_with_subs.mp4`,
        events,
      };
    }
    // Otherwise, return current status and metadata
    return {
      ...job,
      status: job.status,
      events,
    };
  }
}
