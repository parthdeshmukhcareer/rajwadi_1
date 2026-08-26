import { AdminCouponsController } from '../coupons/coupons.controller.js';
import { CouponsService } from '../coupons/coupons.service.js';
import { CouponsRepository } from '../coupons/coupons.repository.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireAdmin } from '../../middleware/admin.middleware.js';

export async function adminCouponRoutes(app) {
  const repo = new CouponsRepository();
  const service = new CouponsService(repo);
  const controller = new AdminCouponsController(service);

  app.addHook('preValidation', requireAuth);
  app.addHook('preValidation', requireAdmin);

  app.get('/', controller.getCoupons);
  app.post('/', controller.createCoupon);
  app.patch('/:id', controller.updateCoupon);
  app.patch('/:id/status', controller.updateCouponStatus);
}
