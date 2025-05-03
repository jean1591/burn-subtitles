import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { TranslationProcessor } from './translation.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'translation',
    }),
  ],
  providers: [TranslationProcessor, RedisService],
  exports: [BullModule],
})
export class QueueModule {}
