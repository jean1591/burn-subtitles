import { Controller, Get, Param, NotFoundException } from "@nestjs/common";
import { QueueService } from "./queue.service";

@Controller("status")
export class StatusController {
  constructor(private readonly queueService: QueueService) {}

  @Get(":uuid")
  async getStatus(@Param("uuid") uuid: string) {
    const job = await this.queueService.getJobStatusByUuid(uuid);
    if (!job) {
      throw new NotFoundException("Job not found");
    }
    // If job is completed, return processing_completed and videoUrl
    if (job.status === "completed") {
      // Assume videoUrl follows the pattern used in emitProcessingCompleted
      return {
        ...job,
        status: "processing_completed",
        videoUrl: `/videos/${uuid}_with_subs.mp4`,
      };
    }
    // Otherwise, return current status and metadata
    return {
      ...job,
      status: job.status,
    };
  }
}
