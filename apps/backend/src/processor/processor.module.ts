// Encapsulates processing logic
import { Module } from "@nestjs/common";
import { TranscodeProcessor } from "./transcode.processor";

@Module({
  providers: [TranscodeProcessor],
})
export class ProcessorModule {}
