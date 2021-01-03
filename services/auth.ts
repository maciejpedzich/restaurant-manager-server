import { Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
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
			const user = await userRepository.findOne(
				{ email: req.body.email },
				{
					// pain
					select: [
						'password',
						'location',
						'lastname',
						'id',
						'firstname',
						'favouriteCategories',
						'email',
						'dateUpdated',
						'dateCreated'
					]
				}
			);

			if (user) {
				const passwordsMatch = await compare(
					req.body.password,
					user.password as string
				);

				if (passwordsMatch) {
					delete req.user?.password;
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
