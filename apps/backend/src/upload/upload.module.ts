import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'translation',
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService, RedisService],
})
export class UploadModule {}
