import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { QueueModule } from './queue/queue.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { StatusGateway } from './gateway/status.gateway';
import { UploadModule } from './upload/upload.module';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    UploadModule,
    QueueModule,
  ],
  controllers: [],
  providers: [StatusGateway],
})
export class AppModule {}
