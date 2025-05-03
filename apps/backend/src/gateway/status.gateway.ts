import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
@WebSocketGateway({ namespace: '/status', cors: true })
export class StatusGateway {
  @WebSocketServer()
  server: Server;

  emitZipReady(batch_id: string) {
    this.server.emit('zipReady', { batch_id });
  }
}
