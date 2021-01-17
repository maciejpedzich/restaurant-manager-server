import { RequestHandler, Response, NextFunction } from 'express';
import RequestWithUser from './interfaces/request-with-user';
import { Server, Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';

import httpServer from './app';
import authMiddleware from './middleware/auth';

const io = new Server(httpServer, {
  cors: {
    origin: process.env.ORIGIN_URL as string,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Authorization']
  }
});

const wrap = (middleware: RequestHandler) => (
  socket: Socket,
  next: (error?: ExtendedError) => void
) =>
  middleware(
    socket.request as RequestWithUser,
    {} as Response,
    next as NextFunction
  );

export default function initSocketIO() {
  io.use(wrap(authMiddleware));

  io.on('connection', (socket: Socket) => {
    socket.on('join room', (name: string) => socket.join(name));

    socket.on('place order', (id: string) =>
      socket.to('staff').emit('order placed', id)
    );

    socket.on('update order', (id: string, status: string) =>
      socket.to(id).emit('order updated', status)
    );
  });
}
