import { ProductsController } from './products.controller.js';
import { ProductsService } from './products.service.js';
import { ProductsRepository } from './products.repository.js';

export async function publicProductRoutes(app) {
  const repo = new ProductsRepository();
  const service = new ProductsService(repo);
  const controller = new ProductsController(service);

  app.get('/', controller.getProducts);
  app.get('/:slug', controller.getProduct);
}
