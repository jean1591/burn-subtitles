import { BullBoardModule } from "./queue/bull-board.module";
import { Module } from "@nestjs/common";
import { ProcessorModule } from "./processor/processor.module";
import { PythonModule } from "./python/python.module";
import { QueueModule } from "./queue/queue.module";
import { UploadModule } from "./upload/upload.module";
import { WebsocketModule } from "./websocket/websocket.module";

@Module({
  imports: [
    UploadModule,
    QueueModule,
    WebsocketModule,
    ProcessorModule,
    PythonModule,
    BullBoardModule,
  ],
})
export class AppModule {}
