import { Errors } from '../../utils/errors.js';
import { db } from '../../db/index.js';
import { productVariants, products } from '../../db/schema/index.js';
import { eq } from 'drizzle-orm';

export class CartService {
  constructor(cartRepo) {
    this.cartRepo = cartRepo;
  }

  async getCart(userId) {
    const cartData = await this.cartRepo.getCartItemsByUserId(userId);
    let subtotal = 0;
    
    const formattedItems = cartData.items.map(item => {
      const availableStock = item.variant.stockOnHand - item.variant.reservedStock;
      const isAvailable = item.product.isActive && item.variant.isActive && availableStock >= item.quantity;
      
      const lineTotal = item.variant.price * item.quantity;
      
      if (isAvailable) {
        subtotal += lineTotal;
      }
      
      return {
        id: item.id,
        product: {
          id: item.product.id,
          name: item.product.name,
          slug: item.product.slug,
          image: item.product.image,
          gstRate: item.product.gstRate,
          variants: item.product.variants,
        },
        variant: {
          id: item.variant.id,
          sku: item.variant.sku,
          size: item.variant.size,
          color: item.variant.color,
          price: item.variant.price,
          availableStock,
        },
        quantity: item.quantity,
        isAvailable,
        lineTotal,
      };
    });

    return {
      id: cartData.cartId,
      items: formattedItems,
      subtotal
    };
  }

  async addCartItem(userId, variantId, quantity) {
    const [variant] = await db.select().from(productVariants).where(eq(productVariants.id, variantId)).limit(1);
    if (!variant) throw Errors.VARIANT_NOT_FOUND();
    
    const [product] = await db.select().from(products).where(eq(products.id, variant.productId)).limit(1);
    if (!product) throw Errors.PRODUCT_NOT_FOUND();
    
    if (!product.isActive) throw Errors.PRODUCT_NOT_AVAILABLE('Product is inactive.');
    if (!variant.isActive) throw Errors.VARIANT_NOT_AVAILABLE('Variant is inactive.');
    
    const availableStock = variant.stockOnHand - variant.reservedStock;
    if (quantity > availableStock) throw Errors.INSUFFICIENT_STOCK(`Only ${availableStock} items available.`);

    const cart = await this.cartRepo.getOrCreateCart(userId);
    
    const item = await this.cartRepo.upsertCartItem(cart.id, variantId, quantity);
    
    if (item.quantity > availableStock) {
      await this.cartRepo.updateCartItemQuantity(item.id, cart.id, availableStock);
      throw Errors.INSUFFICIENT_STOCK(`Total requested exceeds available stock. Adjusted to ${availableStock}.`);
    }

    return this.getCart(userId);
  }

  async updateCartItem(userId, itemId, quantity) {
    const cart = await this.cartRepo.getOrCreateCart(userId);
    
    const item = await this.cartRepo.findCartItemByIdAndCartId(itemId, cart.id);
    if (!item) throw Errors.CART_ITEM_NOT_FOUND();

    const [variant] = await db.select().from(productVariants).where(eq(productVariants.id, item.variantId)).limit(1);
    const [product] = await db.select().from(products).where(eq(products.id, variant.productId)).limit(1);
    
    if (!product.isActive) throw Errors.PRODUCT_NOT_AVAILABLE('Product is inactive.');
    if (!variant.isActive) throw Errors.VARIANT_NOT_AVAILABLE('Variant is inactive.');
    
    const availableStock = variant.stockOnHand - variant.reservedStock;
    if (quantity > availableStock) throw Errors.INSUFFICIENT_STOCK(`Only ${availableStock} items available.`);

    await this.cartRepo.updateCartItemQuantity(itemId, cart.id, quantity);
    
    return this.getCart(userId);
  }

  async deleteCartItem(userId, itemId) {
    const cart = await this.cartRepo.getOrCreateCart(userId);
    const item = await this.cartRepo.findCartItemByIdAndCartId(itemId, cart.id);
    
    if (!item) throw Errors.CART_ITEM_NOT_FOUND();

    await this.cartRepo.deleteCartItem(itemId, cart.id);
  }

  async clearCart(userId) {
    const cart = await this.cartRepo.getOrCreateCart(userId);
    await this.cartRepo.clearCart(cart.id);
  }

  async previewCart(userId, couponCode, couponsService) {
    const cart = await this.getCart(userId);
    let discount = 0;
    let estimatedTotal = cart.subtotal;

    if (couponCode && couponsService && cart.subtotal > 0) {
      const result = await couponsService.validateAndCalculateDiscount(couponCode, cart.subtotal);
      discount = result.discount;
      estimatedTotal -= discount;
    }

    const { env } = await import('../../config/env.js');
    const settingsObj = await (await import('../admin/admin.settings.service.js')).adminSettingsService.getAllSettings();
    const freeShippingThreshold = settingsObj.freeShippingThreshold !== undefined ? settingsObj.freeShippingThreshold : Number(env.FREE_SHIPPING_THRESHOLD);
    const defaultShippingFee = settingsObj.defaultShippingFee !== undefined ? settingsObj.defaultShippingFee : Number(env.DEFAULT_SHIPPING_FEE);
    
    let shipping = 0;
    if (estimatedTotal < freeShippingThreshold && cart.subtotal > 0) {
      shipping = defaultShippingFee;
    }
    
    estimatedTotal += shipping;
    
    // Calculate Tax just for preview if needed, but the original code didn't do it here. We'll leave it as is, or add basic tax preview if frontend expects it (it reads estimatedTotal).

    return {
      subtotal: cart.subtotal,
      discount,
      shipping,
      estimatedTotal,
      cart
    };
  }
}
