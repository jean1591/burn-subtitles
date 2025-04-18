import * as fs from "fs/promises";
import * as path from "path";

// Handles saving files and triggering job enqueue
import { Injectable } from "@nestjs/common";
import type { Multer } from "multer";
import { QueueService } from "../queue/queue.service";
import { WebsocketGateway } from "../websocket/websocket.gateway";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class UploadService {
  constructor(
    private readonly queueService: QueueService,
    private readonly websocketGateway: WebsocketGateway
  ) {}

  async handleUpload(file: Multer.File) {
    // Generate UUID
    const uuid = uuidv4();
    const uploadsDir = path.resolve(process.cwd(), "uploads");
    const newFilename = `${uuid}.mp4`;
    const newFilePath = path.join(uploadsDir, newFilename);

    // Move/rename the file
    await fs.rename(file.path, newFilePath);

    // Enqueue job
    await this.queueService.addJob(uuid, newFilePath);

    // Emit websocket event
    this.websocketGateway.emitVideoAdded(uuid);

    return {
      status: "success",
      uuid,
    };
  }
}
