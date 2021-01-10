import { Response, NextFunction } from 'express';
import { getRepository, getConnection } from 'typeorm';
import { compare, hash } from 'bcrypt';

import RequestWithUser from '../interfaces/request-with-user';
import User from '../models/user';
import EmailRegisteredError from '../errors/email-registered';
import InvalidCredentialsError from '../errors/invalid-credentials';

export default class AuthService {
	public async register(
		req: RequestWithUser,
		res: Response,
		next: NextFunction
	) {
		const userRepository = getRepository(User);

		try {
			const emailRegistered = await userRepository.findOne({
				email: req.body.email
			});

			if (!emailRegistered) {
				req.body.orders = [];
				req.body.password = await hash(req.body.password, 10);

				const user = (userRepository.create(req.body) as unknown) as User;
				req.user = await userRepository.save(user);

				return next();
			}

			throw new EmailRegisteredError();
		} catch (error) {
			return next(error);
		}
	}

	public async logIn(req: RequestWithUser, res: Response, next: NextFunction) {
		const userRepository = getRepository(User);

		try {
			const columns = getConnection()
				.getMetadata(User)
				.ownColumns.map((column) => `user.${column.propertyName}`);

			const user = await userRepository
				.createQueryBuilder('user')
				.select(columns)
				.where('user.email = :email', { email: req.body.email })
				.getOne();

			if (user) {
				const passwordsMatch = await compare(
					req.body.password,
					user.password as string
				);

				if (passwordsMatch) {
					delete user.password;
					req.user = user;

					return next();
				}
			}

			throw new InvalidCredentialsError();
		} catch (error) {
			return next(error);
		}
	}
}
