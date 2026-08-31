import { Errors } from '../../utils/errors.js';
import { db } from '../../db/index.js';
import { addresses } from '../../db/schema/index.js';
import { eq } from 'drizzle-orm';
import { env } from '../../config/env.js';
import { emailService } from '../../services/email.service.js';
import { users } from '../../db/schema/index.js';
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

    const settingsObj = await (await import('../admin/admin.settings.service.js')).adminSettingsService.getAllSettings();
    const freeShippingThreshold = settingsObj.freeShippingThreshold !== undefined ? settingsObj.freeShippingThreshold : Number(env.FREE_SHIPPING_THRESHOLD);
    const defaultShippingFee = settingsObj.defaultShippingFee !== undefined ? settingsObj.defaultShippingFee : Number(env.DEFAULT_SHIPPING_FEE);
    
    let shippingTotal = 0;
    if (taxableTotal < freeShippingThreshold) {
      shippingTotal = defaultShippingFee;
    }

    // Grand total: subtotal includes tax. Subtract discount, add shipping.
    const grandTotal = subtotal - discountTotal + shippingTotal; 

    const expiresAt = new Date(Date.now() + env.ORDER_EXPIRATION_MINUTES * 60000);

    const isCOD = checkoutData.paymentMethod === 'COD';
    
    const orderData = {
      status: isCOD ? 'CONFIRMED' : 'PENDING_PAYMENT',
      paymentStatus: isCOD ? 'COD' : 'PENDING',
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
      
      if (isCOD) {
        const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
        if (user) {
          const emailItems = itemSnapshots.map(item => ({
            quantity: item.quantity,
            price: item.unitPrice,
            size: item.size,
            productName: item.productName
          }));
          emailService.sendOrderConfirmation(order, user, emailItems, order.shippingAddress).catch(console.error);
        }
      }
      
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
    return result;
  }

  async cancelOrder(userId, orderNumber) {
    const result = await this.ordersRepo.getOrderWithItems(userId, orderNumber);
    if (!result) throw Errors.ORDER_NOT_FOUND();
    
    const { order } = result;
    
    if (order.status !== 'PENDING_PAYMENT' && order.status !== 'CONFIRMED') {
      throw new Error('Order cannot be cancelled at this stage.');
    }
    
    if (order.paymentStatus === 'PAID') {
      // Need idempotency key. Can generate one or use order number for simplicity
      await this.ordersRepo.processPaidCancellationTransaction(order.id, userId, `cancel_${order.id}`);
    } else {
      await this.ordersRepo.processUnpaidCancellationTransaction(order.id);
    }
    
    return { success: true };
  }
}
