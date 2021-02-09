import { Server, Socket } from 'socket.io';

import httpServer from './app';

const io = new Server(httpServer, {
  cors: {
    origin: process.env.ORIGIN_URL as string,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Authorization']
  }
});

export default function initSocketIO() {
  io.on('connection', (socket: Socket) => {
    socket.on('join room', (name: string) => socket.join(name));

    socket.on('place order', (id: string) =>
      socket.to('staff').emit('order placed', id)
    );

    socket.on('update order', (id: string, status: string) =>
      socket.to(`order ${id}`).emit('order updated', status)
    );
  });
}
