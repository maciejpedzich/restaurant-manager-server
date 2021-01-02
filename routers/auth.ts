import { Router } from 'express';

import AuthService from '../services/auth';
import authMiddleware from '../middleware/auth';
import generateTokensMiddleware from '../middleware/generate-tokens';

const authService = new AuthService();
const authRouter = Router();

authRouter.post('/register', authService.register);

authRouter.post('/login', authService.logIn);

authRouter.post('/refresh', authMiddleware);

authRouter.use(generateTokensMiddleware);

export default authRouter;
