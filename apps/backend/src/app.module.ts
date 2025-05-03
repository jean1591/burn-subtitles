import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { QueueModule } from './queue/queue.module';
import { StatusGateway } from './gateway/status.gateway';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UploadModule,
    QueueModule,
  ],
  controllers: [],
  providers: [StatusGateway],
})
export class AppModule {}
