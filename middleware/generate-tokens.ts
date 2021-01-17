import { Response, NextFunction } from 'express';
import { sign } from 'jsonwebtoken';

import RequestWithUser from '../interfaces/request-with-user';

export default async function generateTokensMiddleware(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  const secret = process.env.JWT_SECRET as string;

  // prettier-ignore
  const accessToken = sign(
    { userId: req.user?.id, grant: 'ACCESS' },
    secret,
    { expiresIn: '15m' }
  );
  const refreshToken = sign(
    { userId: req.user?.id, grant: 'REFRESH' },
    secret,
    { expiresIn: '7d' }
  );

  res.setHeader('Authorization', accessToken);
  res.cookie('Authorization-Refresh', refreshToken, {
    maxAge: 3600 * 24 * 7 * 1000,
    httpOnly: true
  });

  return res.status(200).json({
    message: 'Authentication successful'
  });
}
