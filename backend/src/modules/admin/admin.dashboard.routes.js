import { AdminDashboardController } from './admin.dashboard.controller.js';
import { AdminDashboardService } from './admin.dashboard.service.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireAdmin } from '../../middleware/admin.middleware.js';

export async function adminDashboardRoutes(app, options) {
  const adminDashboardService = new AdminDashboardService();
  const adminDashboardController = new AdminDashboardController(adminDashboardService);

  app.addHook('preValidation', requireAuth);
  app.addHook('preValidation', requireAdmin);

  app.get('/', adminDashboardController.getDashboard);
}
