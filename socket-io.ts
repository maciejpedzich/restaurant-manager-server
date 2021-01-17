import { RequestHandler, Request, Response, NextFunction } from 'express';
import hasPermissionsMiddleware from 'middleware/has-permissions';
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
const staffNamespace = io.of('/staff');

const wrap = (middleware: RequestHandler) => (
	socket: Socket,
	next: (error?: ExtendedError) => void
) =>
	middleware(socket.request as Request, {} as Response, next as NextFunction);

export default function initSocketIO() {
	io.use(wrap(authMiddleware));
	staffNamespace.use(wrap(hasPermissionsMiddleware(['Employee', 'Owner'])));

	io.on('connection', (socket: Socket) => {
		socket.on('placedOrder', (orderId: string) =>
			staffNamespace.emit('receivedOrder', orderId)
		);
	});

	staffNamespace.on('connection', (socket: Socket) => {
		socket.on(
			'updateOrder',
			(order: { status: string; dateUpdated: Date }) => {}
		);
	});
}
