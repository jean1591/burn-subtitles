import * as fs from 'fs';
import * as path from 'path';

import { Injectable, Logger } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';

import { Job } from 'bull';
import { StatusGateway } from '../gateway/status.gateway';
import { zip } from 'zip-a-folder';

@Processor('zip')
@Injectable()
export class ZipProcessor {
  private readonly logger = new Logger(ZipProcessor.name);

  constructor(private readonly statusGateway: StatusGateway) {}

  @Process()
  async handleZipJob(job: Job) {
    const { batch_id } = job.data;
    const uploadsDir = path.join(process.cwd(), 'uploads', batch_id);
    const tempZip = path.join(
      process.cwd(),
      'uploads',
      `results-${batch_id}.zip`,
    );
    const finalZip = path.join(uploadsDir, 'results.zip');

    try {
      // Delete the 'original' folder if it exists
      const originalDir = path.join(uploadsDir, 'original');
      try {
        await fs.promises.rm(originalDir, { recursive: true, force: true });
        this.logger.log(`Deleted original folder for batch ${batch_id}`);
      } catch (err) {
        // If the folder doesn't exist, ignore
        if (err.code !== 'ENOENT') {
          this.logger.warn(
            `Could not delete original folder for batch ${batch_id}: ${err}`,
          );
        }
      }

      // Zip the entire uploads/<batch_id> folder to a temp location
      await zip(uploadsDir, tempZip);

      // Move the zip file into the batch folder as results.zip
      await fs.promises.rename(tempZip, finalZip);

      this.logger.log(`Created zip for batch ${batch_id} at ${finalZip}`);
      // Notify via WebSocket
      this.statusGateway.emitZipReady(batch_id);
    } catch (err) {
      this.logger.error(`Failed to create zip for batch ${batch_id}: ${err}`);
      throw err;
    }
  }
}
