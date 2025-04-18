// Encapsulates processing logic
import { Module } from "@nestjs/common";
import { TranscodeProcessor } from "./transcode.processor";
import { WebsocketModule } from "../websocket/websocket.module";

@Module({
  imports: [WebsocketModule],
  providers: [TranscodeProcessor],
})
export class ProcessorModule {}
