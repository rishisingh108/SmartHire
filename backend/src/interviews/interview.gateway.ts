import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class InterviewGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private activeRooms = new Map<string, Set<string>>();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.activeRooms.forEach((clients, room) => {
      clients.delete(client.id);
      if (clients.size === 0) {
        this.activeRooms.delete(room);
      }
    });
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @MessageBody() data: { roomId: string; userName: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.roomId);

    if (!this.activeRooms.has(data.roomId)) {
      this.activeRooms.set(data.roomId, new Set());
    }
    this.activeRooms.get(data.roomId)!.add(client.id);

    client.to(data.roomId).emit('user-joined', {
      userId: client.id,
      userName: data.userName,
    });

    console.log(`${data.userName} joined room: ${data.roomId}`);
    return { success: true, room: data.roomId };
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(
    @MessageBody() data: { roomId: string; userName: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(data.roomId);
    client.to(data.roomId).emit('user-left', {
      userId: client.id,
      userName: data.userName,
    });
    console.log(`${data.userName} left room: ${data.roomId}`);
  }

  @SubscribeMessage('interview-status')
  handleInterviewStatus(
    @MessageBody() data: { roomId: string; status: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.server.to(data.roomId).emit('status-update', {
      status: data.status,
      timestamp: new Date().toISOString(),
    });
  }
}