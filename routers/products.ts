import { Router } from 'express';

import ProductsService from '../services/products';
import authMiddleware from '../middleware/auth';
import hasPermissionsMiddleware from '../middleware/has-permissions';
import fileUpload from '../middleware/file-upload';

import validationMiddleware from '../middleware/validation';
import Product from '../models/product';

const productsService = new ProductsService();
const productsRouter = Router();

productsRouter.get('/', productsService.getProducts);

productsRouter.post(
	'/',
	authMiddleware,
	hasPermissionsMiddleware(['Owner']),
	validationMiddleware(Product),
	productsService.createProduct
);

productsRouter.put(
	'/:productId',
	authMiddleware,
	hasPermissionsMiddleware(['Owner']),
	validationMiddleware(Product),
	productsService.editProduct
);

productsRouter.delete(
	'/:productId',
	authMiddleware,
	hasPermissionsMiddleware(['Owner']),
	productsService.removeProduct
);

export default productsRouter;
