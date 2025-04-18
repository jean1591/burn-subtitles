// Handles real-time WebSocket communication with clients
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WebsocketGateway.name);
  // Map video UUID to socket ID
  private uuidToSocketId: Map<string, string> = new Map();
  // Map socket ID to UUID (for cleanup)
  private socketIdToUuid: Map<string, string> = new Map();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    // Cleanup uuid mapping
    const uuid = this.socketIdToUuid.get(client.id);
    if (uuid) {
      this.uuidToSocketId.delete(uuid);
      this.socketIdToUuid.delete(client.id);
      this.logger.debug(`Cleaned up mapping for uuid: ${uuid}`);
    }
  }

  // Client should send: { uuid: string } after connecting
  @SubscribeMessage("register")
  handleRegister(
    @MessageBody() data: { uuid: string },
    @ConnectedSocket() client: Socket
  ) {
    const { uuid } = data;
    if (uuid) {
      this.uuidToSocketId.set(uuid, client.id);
      this.socketIdToUuid.set(client.id, uuid);
      this.logger.log(`Registered uuid ${uuid} to socket ${client.id}`);
      return { event: "register_ack", data: { success: true } };
    }
    return {
      event: "register_ack",
      data: { success: false, error: "No uuid provided" },
    };
  }

  // Helper to send to a specific client by uuid
  sendToClient(uuid: string, event: string, payload: any) {
    const socketId = this.uuidToSocketId.get(uuid);
    if (socketId) {
      this.server.to(socketId).emit(event, payload);
      this.logger.debug(`Sent event '${event}' to uuid ${uuid}`);
    } else {
      this.logger.warn(`No client registered for uuid ${uuid}`);
    }
  }

  // Broadcast events
  emitVideoAdded(uuid: string) {
    this.sendToClient(uuid, "video_added_to_queue", { uuid });
  }

  emitQueuePositionUpdate(uuid: string, position: number) {
    this.sendToClient(uuid, "queue_position_update", { uuid, position });
  }

  emitProcessingStarted(uuid: string) {
    this.sendToClient(uuid, "processing_started", { uuid });
  }

  emitProcessingCompleted(uuid: string, videoUrl: string) {
    this.sendToClient(uuid, "processing_completed", { uuid, videoUrl });
  }

  emitProcessingFailed(uuid: string, error: string) {
    this.sendToClient(uuid, "processing_failed", { uuid, error });
  }
}
