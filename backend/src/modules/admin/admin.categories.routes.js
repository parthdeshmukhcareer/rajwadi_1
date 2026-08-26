import { CategoriesController } from '../categories/categories.controller.js';
import { CategoriesService } from '../categories/categories.service.js';
import { CategoriesRepository } from '../categories/categories.repository.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireAdmin } from '../../middleware/admin.middleware.js';

export async function adminCategoryRoutes(app) {
  const repo = new CategoriesRepository();
  const service = new CategoriesService(repo);
  const controller = new CategoriesController(service);

  app.addHook('preValidation', requireAuth);
  app.addHook('preValidation', requireAdmin);

  app.get('/', controller.getAdminCategories);
  app.post('/', controller.createCategory);
  app.patch('/:id', controller.updateCategory);
  app.patch('/:id/status', controller.updateStatus);
}
