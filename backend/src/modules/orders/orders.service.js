import { Errors } from '../../utils/errors.js';
import { db } from '../../db/index.js';
import { addresses } from '../../db/schema/index.js';
import { eq } from 'drizzle-orm';
import { env } from '../../config/env.js';

export class OrdersService {
  constructor(ordersRepo, cartService, couponsService) {
    this.ordersRepo = ordersRepo;
    this.cartService = cartService;
    this.couponsService = couponsService;
  }

  async processCheckout(userId, checkoutData) {
    const cart = await this.cartService.getCart(userId);
    if (!cart || cart.items.length === 0) throw Errors.EMPTY_CART();

    const [address] = await db.select().from(addresses).where(eq(addresses.id, checkoutData.addressId)).limit(1);
    if (!address || address.userId !== userId) throw Errors.ADDRESS_NOT_FOUND();

    let subtotal = cart.subtotal;
    let discountTotal = 0;
    let couponCode = null;

    if (checkoutData.couponCode) {
      const result = await this.couponsService.validateAndCalculateDiscount(checkoutData.couponCode, subtotal);
      discountTotal = result.discount;
      couponCode = result.coupon.code;
    }

    const taxableTotal = subtotal - discountTotal;
    let remainingDiscount = discountTotal;
    let taxTotal = 0;
    
    const itemSnapshots = [];
    const variantUpdates = [];

    for (let i = 0; i < cart.items.length; i++) {
      const item = cart.items[i];
      if (!item.isAvailable) throw Errors.OUT_OF_STOCK(`Item ${item.variant.sku} is not available.`);
      
      const lineTotal = item.lineTotal;
      let itemDiscount = 0;
      
      if (discountTotal > 0) {
        if (i === cart.items.length - 1) {
          itemDiscount = remainingDiscount;
        } else {
          itemDiscount = Math.floor((lineTotal / subtotal) * discountTotal);
          remainingDiscount -= itemDiscount;
        }
      }

      const postDiscountLineTotal = lineTotal - itemDiscount;

      // GST is INCLUSIVE. Extract tax amount for reporting.
      const gstRate = item.product.gstRate || 0;
      let taxAmount = 0;
      if (gstRate > 0) {
        taxAmount = postDiscountLineTotal - Math.round((postDiscountLineTotal * 100) / (100 + gstRate));
      }
      taxTotal += taxAmount;

      itemSnapshots.push({
        productId: item.product.id,
        variantId: item.variant.id,
        productName: item.product.name,
        sku: item.variant.sku,
        size: item.variant.size,
        color: item.variant.color,
        unitPrice: item.variant.price,
        quantity: item.quantity,
        discountAmount: itemDiscount,
        taxAmount,
        lineTotal, 
        productImage: item.product.image
      });

      variantUpdates.push({
        id: item.variant.id,
        quantity: item.quantity
      });
    }

    const freeShippingThreshold = Number(env.FREE_SHIPPING_THRESHOLD);
    const defaultShippingFee = Number(env.DEFAULT_SHIPPING_FEE);
    
    let shippingTotal = 0;
    if (taxableTotal < freeShippingThreshold) {
      shippingTotal = defaultShippingFee;
    }

    // Grand total: subtotal includes tax. Subtract discount, add shipping.
    const grandTotal = subtotal - discountTotal + shippingTotal; 

    const expiresAt = new Date(Date.now() + env.ORDER_EXPIRATION_MINUTES * 60000);

    const orderData = {
      status: 'PENDING_PAYMENT',
      paymentStatus: 'PENDING',
      subtotal,
      discountTotal,
      taxTotal,
      shippingTotal,
      grandTotal,
      couponCode,
      shippingAddress: address,
      expiresAt
    };

    try {
      const order = await this.ordersRepo.processCheckoutTransaction(userId, orderData, itemSnapshots, variantUpdates, cart.id);
      return order;
    } catch (error) {
      if (error.message.includes('Insufficient stock')) {
        throw Errors.OUT_OF_STOCK(error.message);
      }
      throw error;
    }
  }

  async getUserOrders(userId, query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    
    const { data, total } = await this.ordersRepo.getUserOrders(userId, page, limit);
    return { data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
  }

  async getOrderDetails(userId, orderNumber) {
    const result = await this.ordersRepo.getOrderWithItems(userId, orderNumber);
    if (!result) throw Errors.ORDER_NOT_FOUND();
    
    // We can just return result because getOrderWithItems returns the order row.
    // However, if we need to filter internal things we can do it here. 
    // The order row already contains trackingNumber, shippingCarrier, etc.
    return result;
  }
}
