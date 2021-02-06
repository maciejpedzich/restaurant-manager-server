import { Response, NextFunction } from 'express';
import OrderProduct from 'interfaces/order-product';
import { getRepository } from 'typeorm';

import RequestWithUser from '../interfaces/request-with-user';
import Order from '../models/order';

export default class OrdersService {
  public async getOrders(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    const orderRepository = getRepository(Order);

    try {
      const pageSize = req.query.pageSize
        ? parseInt(req.query.pageSize as string, 10)
        : 10;
      const currentPage = req.query.currentPage
        ? parseInt(req.query.currentPage as string, 10) - 1
        : 0;

      const orders = await orderRepository.find({
        take: pageSize,
        skip: currentPage * pageSize
      });

      return res.status(200).json(orders);
    } catch (error) {
      return next(error);
    }
  }

  public async makeOrder(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    const orderRepository = getRepository(Order);

    try {
      req.body.cost = req.body.cost
        ? req.body.cost
        : (req.body.content as OrderProduct[]).reduce(
            (total, product) => (total += product.cost * product.quantity),
            0
          );

      const order = await orderRepository.save(
        orderRepository.create(req.body)
      );

      return res.status(201).json(order);
    } catch (error) {
      return next(error);
    }
  }

  public async getOrder(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    const orderRepository = getRepository(Order);

    try {
      const order = await orderRepository.findOne(req.params.orderId, {
        relations: ['customer']
      });

      return res.status(200).json(order);
    } catch (error) {
      return next(error);
    }
  }

  public async updateOrder(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    const orderRepository = getRepository(Order);

    try {
      await orderRepository.update(req.params.orderId, req.body);

      return res.status(200).json({ message: 'Order updated successfully' });
    } catch (error) {
      return next(error);
    }
  }
}
