// Encapsulates queue logic
import { Module } from "@nestjs/common";
import { QueueService } from "./queue.service";
import { StatusController } from "./status.controller";

@Module({
  providers: [QueueService],
  exports: [QueueService],
  controllers: [StatusController],
})
export class QueueModule {}
