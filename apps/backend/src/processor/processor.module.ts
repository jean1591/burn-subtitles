// Encapsulates processing logic
import { Module } from "@nestjs/common";
import { PythonModule } from "../python/python.module";
import { TranscodeProcessor } from "./transcode.processor";
import { WebsocketModule } from "../websocket/websocket.module";

@Module({
  imports: [WebsocketModule, PythonModule],
  providers: [TranscodeProcessor],
})
export class ProcessorModule {}
