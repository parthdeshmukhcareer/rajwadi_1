import { AdminCustomersController } from './admin.customers.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireAdmin } from '../../middleware/admin.middleware.js';

export async function adminCustomerRoutes(app) {
  const controller = new AdminCustomersController();

  app.addHook('preValidation', requireAuth);
  app.addHook('preValidation', requireAdmin);

  app.get('/', controller.getCustomers);
}
