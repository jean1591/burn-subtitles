import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { StatusGateway } from '../gateway/status.gateway';
import { TranslationProcessor } from './translation.processor';
import { TranslationsModule } from 'src/translations/translations.module';
import { ZipProcessor } from './zip.processor';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        maxRetriesPerRequest: 3,
        connectTimeout: 10000, // 10 seconds
        commandTimeout: 5000, // 5 seconds timeout for Redis commands
      },
      defaultJobOptions: {
        attempts: 3, // Retry failed jobs 3 times
        removeOnComplete: true, // Remove successful jobs
        timeout: 30000, // 30 seconds timeout for job execution
      },
    }),
    BullModule.registerQueue({
      name: 'translation',
    }),
    BullModule.registerQueue({
      name: 'zip',
    }),
    TranslationsModule,
  ],
  providers: [TranslationProcessor, ZipProcessor, RedisService, StatusGateway],
  exports: [BullModule],
})
export class QueueModule {}
