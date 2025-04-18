import * as path from "path";

// Handles invoking Python scripts for processing
import { Injectable, Logger } from "@nestjs/common";

import { spawn } from "child_process";

@Injectable()
export class PythonService {
  private readonly logger = new Logger(PythonService.name);

  processVideo(inputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const scriptPath = path.resolve(
        __dirname,
        "../../../../../workers/burn-subtitles.py"
      );
      const pythonExecutable = "python";
      const args = [scriptPath, inputPath];
      this.logger.log(
        `Running Python script: ${pythonExecutable} ${args.join(" ")}`
      );
      const child = spawn(pythonExecutable, args);

      child.stdout.on("data", (data) => {
        this.logger.log(`[Python stdout]: ${data}`);
      });
      child.stderr.on("data", (data) => {
        this.logger.error(`[Python stderr]: ${data}`);
      });
      child.on("close", (code) => {
        if (code === 0) {
          this.logger.log("Python script completed successfully.");
          resolve();
        } else {
          this.logger.error(`Python script exited with code ${code}`);
          reject(new Error(`Python script failed with code ${code}`));
        }
      });
      child.on("error", (err) => {
        this.logger.error(`Failed to start Python script: ${err}`);
        reject(err);
      });
    });
  }
}
