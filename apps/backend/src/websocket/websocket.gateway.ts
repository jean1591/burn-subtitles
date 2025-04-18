// Handles real-time WebSocket communication with clients
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";

import { Server } from "socket.io";

@WebSocketGateway()
export class WebsocketGateway {
  @WebSocketServer()
  server: Server;

  emitVideoAdded(uuid: string) {
    this.server.emit("video_added_to_queue", { uuid });
  }
}
