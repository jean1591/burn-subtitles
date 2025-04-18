import { Queue, QueueOptions } from "bullmq";

// Manages job queueing and status tracking
import { Injectable } from "@nestjs/common";

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
}
