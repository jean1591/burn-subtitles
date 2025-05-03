import {
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
@WebSocketGateway({ namespace: '/status', cors: true })
export class StatusGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  emitJobDone(
    batchId: string,
    jobId: string,
    fileName: string,
    language: string,
  ) {
    this.server.emit('jobDone', {
      batchId,
      jobId,
      details: { fileName, language },
    });
  }

  emitBatchComplete(batchId: string) {
    this.server.emit('batchComplete', { batchId });
  }

  emitZipReady(batchId: string) {
    this.server.emit('zipReady', { batchId });
  }

  afterInit() {
    // Optionally log or perform setup
  }
}
