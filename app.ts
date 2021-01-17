import express from 'express';
import { createServer } from 'http';
import 'reflect-metadata';

import { createConnection } from 'typeorm';
import { config as loadENV } from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import uploadImageRouter from './routers/upload-image';
import authRouter from './routers/auth';
import productsRouter from './routers/products';
import ordersRouter from './routers/orders';
import errorMiddleware from './middleware/error';

loadENV();

const app = express();
const httpServer = createServer(app);
const isDevelopmentEnv = process.env.NODE_ENV === 'development';

(async () => {
  try {
    await createConnection({
      type: 'postgres',
      url: process.env.DB_URL as string,
      entities: ['./models/*.ts'],
      logging: isDevelopmentEnv,
      synchronize: isDevelopmentEnv
    });

    app.use(
      cors({
        origin: process.env.ORIGIN_URL as string,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: ['Authorization']
      })
    );
    app.use(express.static('public'));
    app.use(cookieParser());
    app.use(express.json());

    app.use('/upload-image', uploadImageRouter);
    app.use('/api/auth', authRouter);
    app.use('/api/products', productsRouter);
    app.use('/api/orders', ordersRouter);
    app.use(errorMiddleware);

    httpServer.listen(process.env.PORT);
  } catch (error) {
    console.error(error);
  }
})();

export default httpServer;
