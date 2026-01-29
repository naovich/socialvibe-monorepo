import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EventsGateway.name);
  private connectedUsers = new Map<string, string>(); // userId -> socketId

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      // Extract token from handshake
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        this.logger.warn(`Client ${client.id} connected without token`);
        client.disconnect();
        return;
      }

      // Verify JWT
      const payload = this.jwtService.verify(token);
      const userId = payload.sub;
      
      if (!userId) {
        this.logger.warn(`Client ${client.id} has no userId in token`);
        client.disconnect();
        return;
      }
      
      client.userId = userId;

      // Store connection
      this.connectedUsers.set(userId, client.id);

      this.logger.log(`User ${client.userId} connected (socket: ${client.id})`);

      // Notify user is online
      this.server.emit('user:online', { userId: client.userId });

      // Send connected users list
      const onlineUsers = Array.from(this.connectedUsers.keys());
      client.emit('users:online', onlineUsers);
    } catch (error) {
      this.logger.error(`Authentication failed for client ${client.id}:`, error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      this.connectedUsers.delete(client.userId);
      this.logger.log(`User ${client.userId} disconnected`);

      // Notify user is offline
      this.server.emit('user:offline', { userId: client.userId });
    }
  }

  // Emit new post to all users
  notifyNewPost(post: any) {
    this.server.emit('post:new', post);
  }

  // Emit post like to author
  notifyPostLike(authorId: string, data: any) {
    const socketId = this.connectedUsers.get(authorId);
    if (socketId) {
      this.server.to(socketId).emit('post:liked', data);
    }
  }

  // Emit new comment to post author
  notifyNewComment(authorId: string, data: any) {
    const socketId = this.connectedUsers.get(authorId);
    if (socketId) {
      this.server.to(socketId).emit('comment:new', data);
    }
  }

  // Emit friend request
  notifyFriendRequest(userId: string, data: any) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('friend:request', data);
    }
  }

  // Emit friend request accepted
  notifyFriendAccepted(userId: string, data: any) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('friend:accepted', data);
    }
  }

  // Get online users
  getOnlineUsers(): string[] {
    return Array.from(this.connectedUsers.keys());
  }

  // Check if user is online
  isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }
}
