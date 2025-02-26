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
  role: 'tracker' | 'watcher' | 'babysitter' | 'parent';
}

interface ChatMessage {
  userId: number;
  recipientId: number;
  content: string;
  timestamp: number;
  status: 'sent' | 'delivered' | 'read';
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

  // Store active connections
  const activeUsers = new Map<number, Socket>();

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

    // Store user's socket connection
    activeUsers.set(userId, socket);

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
    socket.on('send_message', async (message: ChatMessage) => {
      // Save message to database (implement this)
      const savedMessage = {
        ...message,
        id: Date.now(), // Replace with actual DB id
        status: 'sent'
      };

      // Send to recipient if online
      const recipientSocket = activeUsers.get(message.recipientId);
      if (recipientSocket) {
        recipientSocket.emit('receive_message', {
          ...savedMessage,
          senderId: userId
        });

        // Update message status to delivered
        savedMessage.status = 'delivered';
        socket.emit('message_status', {
          messageId: savedMessage.id,
          status: 'delivered'
        });
      }

      // Send back to sender with status
      socket.emit('message_sent', savedMessage);
    });

    // Handle message status updates
    socket.on('message_read', (messageIds: number[]) => {
      // Update message status in database (implement this)
      messageIds.forEach(messageId => {
        // Find original sender and notify them
        // This would come from the database in a real implementation
        const senderId = 1; // Example
        const senderSocket = activeUsers.get(senderId);
        if (senderSocket) {
          senderSocket.emit('message_status', {
            messageId,
            status: 'read'
          });
        }
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

    // Handle typing indicators
    socket.on('typing_start', (recipientId: number) => {
      io.to(`user:${recipientId}`).emit('typing_start', userId);
    });

    socket.on('typing_stop', (recipientId: number) => {
      io.to(`user:${recipientId}`).emit('typing_stop', userId);
    });

    socket.on('disconnect', () => {
      activeUsers.delete(userId);
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