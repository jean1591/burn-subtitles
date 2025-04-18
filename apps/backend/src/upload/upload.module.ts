// Encapsulates upload logic
import { Module } from "@nestjs/common";
import { QueueModule } from "../queue/queue.module";
import { UploadController } from "./upload.controller";
import { UploadService } from "./upload.service";
import { WebsocketModule } from "../websocket/websocket.module";

@Module({
  imports: [QueueModule, WebsocketModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
