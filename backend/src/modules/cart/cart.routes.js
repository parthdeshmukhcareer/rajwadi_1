import { CartController } from './cart.controller.js';
import { CartService } from './cart.service.js';
import { CartRepository } from './cart.repository.js';
import { CouponsService } from '../coupons/coupons.service.js';
import { CouponsRepository } from '../coupons/coupons.repository.js';
import { requireAuth } from '../../middleware/auth.middleware.js';

export async function cartRoutes(app) {
  const cartRepo = new CartRepository();
  const cartService = new CartService(cartRepo);
  const couponsRepo = new CouponsRepository();
  const couponsService = new CouponsService(couponsRepo);
  const controller = new CartController(cartService, couponsService);

  app.addHook('preValidation', requireAuth);

  app.get('/', controller.getCart);
  app.post('/items', controller.addCartItem);
  app.patch('/items/:id', controller.updateCartItem);
  app.delete('/items/:id', controller.deleteCartItem);
  app.delete('/', controller.clearCart);
  app.post('/preview', controller.previewCart);
}
