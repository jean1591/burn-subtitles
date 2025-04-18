// Encapsulates Python integration logic
import { Module } from "@nestjs/common";
import { PythonService } from "./python.service";

@Module({
  providers: [PythonService],
  exports: [PythonService],
})
export class PythonModule {}
