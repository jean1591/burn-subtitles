import { Module } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduledTasksService } from './scheduled-tasks.service';
import { TranslationsModule } from '../translations/translations.module';

@Module({
  imports: [ScheduleModule.forRoot(), TranslationsModule],
  providers: [ScheduledTasksService, RedisService],
})
export class CronModule {}
