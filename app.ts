import express from 'express';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { config as loadENV } from 'dotenv';
import cors from 'cors';

import errorMiddleware from './middleware/error';

loadENV();

const app = express();
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
				allowedHeaders: ['Content-Type', 'Authorization']
			})
		);
		app.use(express.json());
		app.use(errorMiddleware);

		app.listen(process.env.PORT);
	} catch (error) {
		console.error(error);
	}
})();
