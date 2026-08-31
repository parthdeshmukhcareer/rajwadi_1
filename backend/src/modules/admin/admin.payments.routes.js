import { AdminPaymentsController } from './admin.payments.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireAdmin } from '../../middleware/admin.middleware.js';

export async function adminPaymentRoutes(app) {
  const controller = new AdminPaymentsController();
  
  app.addHook('preValidation', requireAuth);
  app.addHook('preValidation', requireAdmin);

  app.get('/', controller.getPayments);
}
