import { Router } from 'express';

import AuthService from '../services/auth';
import authMiddleware from '../middleware/auth';
import generateTokensMiddleware from '../middleware/generate-tokens';
import validationMiddleware from '../middleware/validation';
import User from '../models/user';

const authService = new AuthService();
const authRouter = Router();

// prettier-ignore
authRouter.post(
  '/register',
  validationMiddleware(User),
  authService.register
);

authRouter.post(
	'/login',
	validationMiddleware(User, { skipMissingProperties: true }),
	authService.logIn
);

authRouter.post('/refresh', authMiddleware);

authRouter.use(generateTokensMiddleware);

export default authRouter;
