import { Response, NextFunction } from 'express';

import RequestWithUser from '../interfaces/request-with-user';
import MissingPermissionsError from '../errors/missing-permissions';

export default function hasPermissionsMiddleware(permArr: string[]) {
	return function (req: RequestWithUser, res: Response, next: NextFunction) {
		try {
			if (permArr.includes(req.user?.permissions as string)) {
				return next();
			}

			throw new MissingPermissionsError();
		} catch (error) {
			return next(error);
		}
	};
}
