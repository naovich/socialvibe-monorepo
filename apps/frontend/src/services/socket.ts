import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class SocketService {
  private socket: Socket | null = null;
  private listeners = new Map<string, Set<Function>>();

  connect(token: string) {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket error:', error);
    });

    // Setup event listeners
    this.setupListeners();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
  }

  private setupListeners() {
    if (!this.socket) return;

    // User online/offline
    this.socket.on('user:online', (data) => this.emit('user:online', data));
    this.socket.on('user:offline', (data) => this.emit('user:offline', data));
    this.socket.on('users:online', (data) => this.emit('users:online', data));

    // Posts
    this.socket.on('post:new', (data) => this.emit('post:new', data));
    this.socket.on('post:liked', (data) => this.emit('post:liked', data));

    // Comments
    this.socket.on('comment:new', (data) => this.emit('comment:new', data));

    // Friends
    this.socket.on('friend:request', (data) => this.emit('friend:request', data));
    this.socket.on('friend:accepted', (data) => this.emit('friend:accepted', data));

    // Messages
    this.socket.on('message:new', (data) => this.emit('message:new', data));
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
    }
  }

  private emit(event: string, data: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((callback) => callback(data));
    }
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const socketService = new SocketService();
