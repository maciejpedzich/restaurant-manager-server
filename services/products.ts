import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import RequestWithUser from '../interfaces/request-with-user';
import Product from '../models/product';

export default class ProductsService {
	public async getProducts(req: Request, res: Response, next: NextFunction) {
		const productRepository = getRepository(Product);

		try {
			const products = await productRepository.find();

			return res.status(200).json(products);
		} catch (error) {
			return next(error);
		}
	}

	public async createProduct(
		req: RequestWithUser,
		res: Response,
		next: NextFunction
	) {
		const productRepository = getRepository(Product);

		try {
			const product = await productRepository.save(
				productRepository.create(req.body)
			);

			return res.status(201).json(product);
		} catch (error) {
			return next(error);
		}
	}

	public async editProduct(
		req: RequestWithUser,
		res: Response,
		next: NextFunction
	) {
		const productRepository = getRepository(Product);

		try {
			await productRepository.update(req.params.productId, req.body);

			return res.status(200).json({ message: 'Product updated successfully' });
		} catch (error) {
			return next(error);
		}
	}

	public async removeProduct(
		req: RequestWithUser,
		res: Response,
		next: NextFunction
	) {
		const productRepository = getRepository(Product);

		try {
			await productRepository.delete(req.params.productId);

			return res.status(200).json({ message: 'Product removed successfully' });
		} catch (error) {
			return next(error);
		}
	}
}
