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
    const { bookingId, userId, role } = socket.handshake.auth as SocketData;

    if (!userId) {
      return next(new Error('Authentication failed'));
    }

    socket.data = { bookingId, userId, role };
    next();
  });

  io.on('connection', (socket: Socket) => {
    const { bookingId, role } = socket.data as SocketData;

    console.log(`Client connected - Role: ${role}, Booking: ${bookingId}`);

    if (bookingId) {
      socket.join(`booking:${bookingId}`);
    }

    socket.on('location_update', (location: LocationUpdate) => {
      if (role === 'tracker' && bookingId) {
        socket.to(`booking:${bookingId}`).emit('location_update', location);
      }
    });

    socket.on('disconnect', () => {
      if (bookingId) {
        socket.leave(`booking:${bookingId}`);
      }
      console.log(`Client disconnected - Role: ${role}, Booking: ${bookingId}`);
    });
  });

  return io;
}