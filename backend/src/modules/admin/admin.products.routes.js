import { AdminProductsController } from './admin.products.controller.js';
import { ProductsService } from '../products/products.service.js';
import { ProductsRepository } from '../products/products.repository.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireAdmin } from '../../middleware/admin.middleware.js';

export async function adminProductRoutes(app) {
  const repo = new ProductsRepository();
  const service = new ProductsService(repo);
  const controller = new AdminProductsController(service);

  app.addHook('preValidation', requireAuth);
  app.addHook('preValidation', requireAdmin);

  app.get('/', controller.getProducts);
  app.get('/:id', controller.getProduct);
  app.post('/', controller.createProduct);
  app.patch('/:id', controller.updateProduct);
  app.patch('/:id/status', controller.updateProductStatus);
  app.delete('/:id', controller.deleteProduct);

  app.post('/:productId/variants', controller.createVariant);
  app.patch('/variants/:id', controller.updateVariant);
  app.patch('/variants/:id/stock', controller.updateVariantStock);
}
