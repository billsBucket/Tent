import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import type { Socket } from 'socket.io';

interface LocationUpdate {
  lat: number;
  lng: number;
  timestamp: number;
}

interface SocketData {
  bookingId?: string;
  userId: number;
  role: 'tracker' | 'watcher';
}

interface ChatMessage {
  userId: number;
  recipientId: number;
  content: string;
  timestamp: number;
}

interface Notification {
  userId: number;
  type: string;
  title: string;
  message: string;
  timestamp: number;
}

export function setupWebSocket(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    path: '/api/socket',
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? false 
        : ['http://localhost:3000'],
      credentials: true
    }
  });

  // Authentication middleware
  io.use((socket: Socket, next: (err?: Error) => void) => {
    const { userId, role } = socket.handshake.auth as SocketData;

    if (!userId) {
      return next(new Error('Authentication failed'));
    }

    socket.data = { userId, role };
    next();
  });

  io.on('connection', (socket: Socket) => {
    const { userId, role, bookingId } = socket.data as SocketData;
    console.log(`Client connected - Role: ${role}, User: ${userId}`);

    // Join user's personal room for direct messages and notifications
    socket.join(`user:${userId}`);

    // Join booking room if applicable
    if (bookingId) {
      socket.join(`booking:${bookingId}`);
    }

    // Handle location updates
    socket.on('location_update', (location: LocationUpdate) => {
      if (role === 'tracker' && bookingId) {
        socket.to(`booking:${bookingId}`).emit('location_update', {
          ...location,
          userId
        });
      }
    });

    // Handle chat messages
    socket.on('send_message', (message: ChatMessage) => {
      io.to(`user:${message.recipientId}`).emit('receive_message', {
        ...message,
        senderId: userId
      });
    });

    // Handle notifications
    socket.on('notification', (notification: Notification) => {
      io.to(`user:${notification.userId}`).emit('notification', notification);
    });

    // Handle booking status updates
    socket.on('booking_update', (data: { bookingId: string; status: string }) => {
      io.to(`booking:${data.bookingId}`).emit('booking_status', {
        bookingId: data.bookingId,
        status: data.status,
        updatedBy: userId
      });
    });

    socket.on('disconnect', () => {
      if (bookingId) {
        socket.leave(`booking:${bookingId}`);
      }
      socket.leave(`user:${userId}`);
      console.log(`Client disconnected - Role: ${role}, User: ${userId}`);
    });

    // Error handling
    socket.on('error', (error) => {
      console.error('Socket error:', error);
      socket.emit('error', { message: 'An error occurred' });
    });
  });

  return io;
}
