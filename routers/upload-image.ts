import { Response, NextFunction, Router } from 'express';

import RequestWithUser from '../interfaces/request-with-user';
import authMiddleware from '../middleware/auth';
import hasPermissionsMiddleware from '../middleware/has-permissions';
import fileUploadMiddleware from '../middleware/file-upload';

const uploadImageRouter = Router();

uploadImageRouter.post(
  '/',
  authMiddleware,
  hasPermissionsMiddleware(['Owner']),
  fileUploadMiddleware.single('image'),
  (req: RequestWithUser, res: Response, next: NextFunction) => {
    const host = req.headers.host;
    const file = req.file;
    const url = `${req.protocol}://${host}/${file.filename}`;

    return res.status(200).json({ url });
  }
);

export default uploadImageRouter;
