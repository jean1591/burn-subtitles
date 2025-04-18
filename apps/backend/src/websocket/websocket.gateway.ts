// Handles real-time WebSocket communication with clients
import { WebSocketGateway } from "@nestjs/websockets";

@WebSocketGateway()
export class WebsocketGateway {
  // Will handle WebSocket events and notifications
}
