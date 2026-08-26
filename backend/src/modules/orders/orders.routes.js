import { OrdersController } from './orders.controller.js';
import { OrdersService } from './orders.service.js';
import { OrdersRepository } from './orders.repository.js';
import { CartRepository } from '../cart/cart.repository.js';
import { CartService } from '../cart/cart.service.js';
import { CouponsRepository } from '../coupons/coupons.repository.js';
import { CouponsService } from '../coupons/coupons.service.js';
import { requireAuth } from '../../middleware/auth.middleware.js';

export async function orderRoutes(app) {
  const ordersRepo = new OrdersRepository();
  const cartRepo = new CartRepository();
  const cartService = new CartService(cartRepo);
  const couponsRepo = new CouponsRepository();
  const couponsService = new CouponsService(couponsRepo);
  
  const ordersService = new OrdersService(ordersRepo, cartService, couponsService);
  const controller = new OrdersController(ordersService);

  app.addHook('preValidation', requireAuth);

  app.post('/checkout', controller.checkout);
  app.get('/', controller.getUserOrders);
  app.get('/:orderNumber', controller.getOrderDetails);
}
