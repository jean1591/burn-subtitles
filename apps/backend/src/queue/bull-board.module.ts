import { BullBoardController } from "./bull-board.controller";
import { BullBoardService } from "./bull-board.service";
import { Module } from "@nestjs/common";
import { QueueModule } from "./queue.module";

@Module({
  imports: [QueueModule],
  controllers: [BullBoardController],
  providers: [BullBoardService],
  exports: [BullBoardService],
})
export class BullBoardModule {}
