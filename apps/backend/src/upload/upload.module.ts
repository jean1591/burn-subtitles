import { AuthModule } from '../auth/auth.module';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { TranslationsModule } from 'src/translations/translations.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'translation',
    }),
    TypeOrmModule.forFeature([User]),
    AuthModule,
    TranslationsModule,
  ],
  controllers: [UploadController],
  providers: [UploadService, RedisService],
})
export class UploadModule {}
