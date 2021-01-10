import { Request, Response, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';
import {
	validateOrReject,
	ValidationError,
	ValidatorOptions
} from 'class-validator';

import StringMap from '../interfaces/string-map';
import InvalidDataError from '../errors/invalid-data';

export default function validationMiddleware(
	type: any,
	validatorOpts?: ValidatorOptions
) {
	return async function (req: Request, res: Response, next: NextFunction) {
		try {
			const body = plainToClass(type, req.body);
			await validateOrReject(body, validatorOpts);

			return next();
		} catch (errors) {
			const errorMessage = (errors as ValidationError[]).reduce(
				(msg, error) => {
					const errConstraints = Object.values(
						error.constraints as StringMap<string>
					).join(', ');
					msg += `${errConstraints}; `;

					return msg;
				},
				''
			);

			return next(new InvalidDataError(errorMessage));
		}
	};
}
