import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { StatusGateway } from '../gateway/status.gateway';
import { TranslationProcessor } from './translation.processor';
import { ZipProcessor } from './zip.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'translation',
    }),
    BullModule.registerQueue({
      name: 'zip',
    }),
  ],
  providers: [TranslationProcessor, ZipProcessor, RedisService, StatusGateway],
  exports: [BullModule],
})
export class QueueModule {}
