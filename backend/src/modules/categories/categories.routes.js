import { CategoriesController } from './categories.controller.js';
import { CategoriesService } from './categories.service.js';
import { CategoriesRepository } from './categories.repository.js';
import { ProductsController } from '../products/products.controller.js';
import { ProductsService } from '../products/products.service.js';
import { ProductsRepository } from '../products/products.repository.js';

export async function publicCategoryRoutes(app) {
  const catRepo = new CategoriesRepository();
  const catService = new CategoriesService(catRepo);
  const catController = new CategoriesController(catService);

  const prodRepo = new ProductsRepository();
  const prodService = new ProductsService(prodRepo);
  const prodController = new ProductsController(prodService);

  app.get('/', catController.getPublicCategories);
  app.get('/:slug/products', prodController.getProductsByCategory);
}
