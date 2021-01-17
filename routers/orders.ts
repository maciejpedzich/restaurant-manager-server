import { Router } from 'express';

import OrdersService from '../services/orders';
import authMiddleware from '../middleware/auth';
import hasPermissionsMiddleware from '../middleware/has-permissions';
import validationMiddleware from '../middleware/validation';
import Order from '../models/order';

const ordersService = new OrdersService();
const ordersRouter = Router();

ordersRouter.get(
  '/',
  authMiddleware,
  hasPermissionsMiddleware(['Employee', 'Owner']),
  ordersService.getOrders
);

ordersRouter.post(
  '/',
  authMiddleware,
  validationMiddleware(Order, { skipMissingProperties: true }),
  ordersService.makeOrder
);

ordersRouter.put(
  '/:orderId',
  authMiddleware,
  hasPermissionsMiddleware(['Employee', 'Owner']),
  ordersService.updateOrder
);

export default ordersRouter;
