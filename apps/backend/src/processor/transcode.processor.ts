// Handles background video/audio processing jobs
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Job, QueueOptions, Worker } from "bullmq";

import { WebsocketGateway } from "../websocket/websocket.gateway";

const queueOptions: QueueOptions = {
  connection: {
    host: "localhost",
    port: 6379,
  },
};

@Injectable()
export class TranscodeProcessor implements OnModuleInit {
  private readonly logger = new Logger(TranscodeProcessor.name);
  private worker: Worker;

  constructor(private readonly websocketGateway: WebsocketGateway) {}

  onModuleInit() {
    this.logger.log("Initializing BullMQ Worker for video-processing queue");
    this.worker = new Worker(
      "video-processing",
      async (job: Job) => {
        const { uuid, filepath } = job.data;
        this.logger.log(
          `Processing started for uuid: ${uuid}, file: ${filepath}`
        );
        this.websocketGateway.emitProcessingStarted(uuid);
        try {
          // Simulate processing delay (replace with Python integration later)
          await new Promise((resolve) => setTimeout(resolve, 10000));

          // Placeholder: Call Python script here in the future
          // const result = await this.pythonService.processVideo(filepath);

          // Simulate output video URL
          const videoUrl = `/videos/${uuid}.mp4`;
          this.logger.log(`Processing completed for uuid: ${uuid}`);
          this.websocketGateway.emitProcessingCompleted(uuid, videoUrl);
        } catch (error) {
          this.logger.error(`Processing failed for uuid: ${uuid}`, error.stack);
          this.websocketGateway.emitProcessingFailed(
            uuid,
            error.message || "Unknown error"
          );
        }
      },
      queueOptions
    );
    this.worker.on("failed", (job, err) => {
      if (job && job.data && job.data.uuid) {
        const { uuid } = job.data;
        this.logger.error(`Job failed for uuid: ${uuid}`, err.stack);
        this.websocketGateway.emitProcessingFailed(
          uuid,
          err.message || "Unknown error"
        );
      } else {
        this.logger.error(`Job failed but uuid is missing`, err?.stack);
      }
    });
  }
}
