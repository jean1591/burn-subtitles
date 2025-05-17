import * as fs from 'fs/promises';
import * as path from 'path';

import { Injectable, Logger } from '@nestjs/common';

import { Cron } from '@nestjs/schedule';
import { RedisService } from '../redis/redis.service';
import { TranslationsService } from '../translations/translations.service';

@Injectable()
export class ScheduledTasksService {
  private readonly logger = new Logger(ScheduledTasksService.name);

  constructor(
    private readonly translationsService: TranslationsService,
    private readonly redisService: RedisService,
  ) {}

  @Cron('0 0 * * *', { timeZone: 'UTC' }) // Run at midnight UTC (2AM French time)
  async handleExpiredBatches() {
    this.logger.log('Starting expired batches cleanup job');

    try {
      const expiredBatches = await this.translationsService.getExpiredBatches();

      for (const batchId of expiredBatches) {
        try {
          // Delete the batch directory
          const batchDir = path.join('uploads', batchId);
          await fs.rm(batchDir, { recursive: true, force: true });
          this.logger.log(`Deleted directory for batch ${batchId}`);

          // Clean up Redis keys
          const jobIds = await this.redisService.lrange(
            `batch:${batchId}:jobs`,
            0,
            -1,
          );
          for (const jobId of jobIds) {
            await this.redisService.del(`job:${jobId}`);
          }
          await this.redisService.del(`batch:${batchId}:jobs`);
          await this.redisService.del(`batch:${batchId}`);
          this.logger.log(`Cleaned up Redis keys for batch ${batchId}`);

          // Mark translations as deleted
          await this.translationsService.markAsDeleted(batchId);
          this.logger.log(
            `Marked translations as deleted for batch ${batchId}`,
          );
        } catch (error) {
          this.logger.error(
            `Error processing batch ${batchId}: ${error.message}`,
            error.stack,
          );
          // Continue with next batch even if this one failed
        }
      }

      this.logger.log('Completed expired batches cleanup job');
    } catch (error) {
      this.logger.error(
        `Error in expired batches cleanup job: ${error.message}`,
        error.stack,
      );
    }
  }
}
