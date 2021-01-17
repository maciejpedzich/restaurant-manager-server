import { Request } from 'express';
import User from '../models/user';

export default interface RequestWithUser extends Request {
  user?: User;
}
