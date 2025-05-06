import {
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';

import { Injectable, Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { EventTypes } from '../constants/events';

@Injectable()
@WebSocketGateway({
  namespace: '/status',
  cors: {
    origin: [
      'https://titro.app',
      'https://www.titro.app',
      'http://localhost:5173',
    ],
    credentials: true,
  },
})
export class StatusGateway implements OnGatewayInit {
  private readonly logger = new Logger(StatusGateway.name);

  @WebSocketServer()
  server: Server;

  @SubscribeMessage(EventTypes.REGISTER)
  handleRegister(@MessageBody() data: { batchId: string }): void {
    this.logger.log(`Client registered for batch: ${data.batchId}`);
    // We could join a room here based on batchId if needed
  }

  emitJobStarted(
    batchId: string,
    jobId: string,
    fileName: string,
    language: string,
  ) {
    this.server.emit(EventTypes.JOB_STARTED, {
      batchId,
      jobId,
      details: { fileName, language },
    });
    this.logger.debug(`Emitted jobStarted for batch ${batchId}, job ${jobId}`);
  }

  emitJobDone(
    batchId: string,
    jobId: string,
    fileName: string,
    language: string,
  ) {
    this.server.emit(EventTypes.JOB_DONE, {
      batchId,
      jobId,
      details: { fileName, language },
    });
    this.logger.debug(`Emitted jobDone for batch ${batchId}, job ${jobId}`);
  }

  emitBatchComplete(batchId: string) {
    this.server.emit(EventTypes.BATCH_COMPLETE, { batchId });
    this.logger.debug(`Emitted batchComplete for batch ${batchId}`);
  }

  emitZipReady(batchId: string, zipUrl: string) {
    this.server.emit(EventTypes.ZIP_READY, { batchId, zipUrl });
    this.logger.debug(`Emitted zipReady for batch ${batchId}, url: ${zipUrl}`);
  }

  afterInit() {
    this.logger.log('WebSocket gateway initialized');
  }
}
