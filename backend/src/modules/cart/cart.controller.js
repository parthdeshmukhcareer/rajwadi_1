import { addCartItemSchema, updateCartItemSchema, cartPreviewSchema } from './cart.schema.js';
import { Errors } from '../../utils/errors.js';

export class CartController {
  constructor(cartService, couponsService) {
    this.cartService = cartService;
    this.couponsService = couponsService;
  }

  getCart = async (req, reply) => {
    const userId = req.user.sub;
    const cart = await this.cartService.getCart(userId);
    return reply.send({ success: true, data: cart });
  }

  addCartItem = async (req, reply) => {
    const userId = req.user.sub;
    const result = addCartItemSchema.safeParse(req.body);
    if (!result.success) throw Errors.VALIDATION_ERROR(result.error.issues[0].message);
    
    const cart = await this.cartService.addCartItem(userId, result.data.variantId, result.data.quantity);
    return reply.status(201).send({ success: true, data: cart });
  }

  updateCartItem = async (req, reply) => {
    const userId = req.user.sub;
    const { id } = req.params;
    const result = updateCartItemSchema.safeParse(req.body);
    if (!result.success) throw Errors.VALIDATION_ERROR(result.error.issues[0].message);
    
    const cart = await this.cartService.updateCartItem(userId, id, result.data.quantity);
    return reply.send({ success: true, data: cart });
  }

  deleteCartItem = async (req, reply) => {
    const userId = req.user.sub;
    const { id } = req.params;
    await this.cartService.deleteCartItem(userId, id);
    return reply.send({ success: true, data: { message: 'Item removed' } });
  }

  clearCart = async (req, reply) => {
    const userId = req.user.sub;
    await this.cartService.clearCart(userId);
    return reply.send({ success: true, data: { message: 'Cart cleared' } });
  }

  previewCart = async (req, reply) => {
    const userId = req.user.sub;
    const result = cartPreviewSchema.safeParse(req.body);
    let couponCode = null;
    if (result.success && result.data.couponCode) {
      couponCode = result.data.couponCode;
    }
    
    const preview = await this.cartService.previewCart(userId, couponCode, this.couponsService);
    return reply.send({ success: true, data: preview });
  }
}
