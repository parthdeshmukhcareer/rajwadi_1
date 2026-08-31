import { AdminReportsController } from './admin.reports.controller.js';
import { AdminReportsService } from './admin.reports.service.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireAdmin } from '../../middleware/admin.middleware.js';

export async function adminReportsRoutes(app, options) {
  const adminReportsService = new AdminReportsService();
  const adminReportsController = new AdminReportsController(adminReportsService);

  app.addHook('preValidation', requireAuth);
  app.addHook('preValidation', requireAdmin);

  app.get('/sales', adminReportsController.getSalesReport);
}
