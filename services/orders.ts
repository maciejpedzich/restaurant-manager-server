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
			const orders = await orderRepository.find();

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
			req.body.cost = (req.body.content as OrderProduct[]).reduce(
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
			const order = await orderRepository.update(req.params.orderId, req.body);

			return res.status(200).json({ message: 'Order updated successfully' });
		} catch (error) {
			return next(error);
		}
	}
}
