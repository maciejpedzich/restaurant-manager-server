import BaseHttpError from '../errors/base-http';
import { Request, Response, NextFunction } from 'express';

export default function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (
    process.env.NODE_ENV === 'development' &&
    !(error instanceof BaseHttpError)
  ) {
    console.error(error);
  }

  let status = 500;
  let message = 'An unexpected error occurred';

  if (error instanceof BaseHttpError) {
    status = error.status;
    message = error.message;
  }

  return res.status(status).json({ message });
}
