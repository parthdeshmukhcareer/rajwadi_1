import { db } from '../../db/index.js';
import { orders, orderItems, productVariants, cartItems, carts, payments, paymentAttempts, refunds } from '../../db/schema/index.js';
import { eq, sql, inArray, and, desc } from 'drizzle-orm';

export class OrdersRepository {
  async processCheckoutTransaction(userId, orderData, itemSnapshots, variantUpdates, cartId) {
    return await db.transaction(async (tx) => {
      // 1. Lock cart row
      await tx.select().from(carts).where(eq(carts.id, cartId)).for('update');

      // 2. Lock variants deterministically
      const variantIds = variantUpdates.map(v => v.id).sort();
      const lockedVariants = await tx.select()
        .from(productVariants)
        .where(inArray(productVariants.id, variantIds))
        .for('update');
        
      const lockedVariantsMap = new Map();
      lockedVariants.forEach(v => lockedVariantsMap.set(v.id, v));

      // 3. Re-validate stock
      for (const update of variantUpdates) {
        const variant = lockedVariantsMap.get(update.id);
        if (!variant) throw new Error('Variant not found during lock');
        const availableStock = variant.stockOnHand - variant.reservedStock;
        if (update.quantity > availableStock) {
          throw new Error(`Insufficient stock for variant ${variant.sku}`);
        }
      }

      // 4. Update reserved_stock
      for (const update of variantUpdates) {
        await tx.update(productVariants)
          .set({ 
            reservedStock: sql`${productVariants.reservedStock} + ${update.quantity}`,
            updatedAt: new Date()
          })
          .where(eq(productVariants.id, update.id));
      }

      // 5. Generate Order Number
      const [{ nextval }] = await tx.execute(sql`SELECT nextval('order_number_seq')`);
      const orderNumber = `RJD-${new Date().getFullYear()}-${String(nextval).padStart(6, '0')}`;

      // 6. Create Order
      const [order] = await tx.insert(orders).values({
        ...orderData,
        orderNumber,
        userId
      }).returning();

      // 7. Create Order Items
      const itemsToInsert = itemSnapshots.map(item => ({ ...item, orderId: order.id }));
      await tx.insert(orderItems).values(itemsToInsert);

      // 8. Clear Cart Items
      await tx.delete(cartItems).where(eq(cartItems.cartId, cartId));

      return order;
    });
  }

  async getExpiredPendingOrders() {
    return await db.select().from(orders).where(and(eq(orders.status, 'PENDING_PAYMENT'), sql`${orders.expiresAt} <= NOW()`));
  }

  async processOrderExpirationTransaction(orderId) {
    return await db.transaction(async (tx) => {
      const [order] = await tx.select().from(orders).where(eq(orders.id, orderId)).for('update');
      if (order.status !== 'PENDING_PAYMENT') return false;
      
      const items = await tx.select().from(orderItems).where(eq(orderItems.orderId, orderId));
      
      const variantMap = new Map();
      items.forEach(item => {
        const qty = variantMap.get(item.variantId) || 0;
        variantMap.set(item.variantId, qty + item.quantity);
      });
      
      const variantIds = Array.from(variantMap.keys()).sort();
      if (variantIds.length > 0) {
        await tx.select().from(productVariants).where(inArray(productVariants.id, variantIds)).for('update');
        for (const [vId, qty] of variantMap.entries()) {
          await tx.update(productVariants)
            .set({ 
              reservedStock: sql`GREATEST(${productVariants.reservedStock} - ${qty}, 0)`,
              updatedAt: new Date()
            })
            .where(eq(productVariants.id, vId));
        }
      }

      await tx.update(orders).set({ status: 'EXPIRED', updatedAt: new Date() }).where(eq(orders.id, orderId));
      return true;
    });
  }

  async getUserOrders(userId, page, limit) {
    const offset = (page - 1) * limit;
    const [countRes] = await db.select({ count: sql`count(*)`.mapWith(Number) }).from(orders).where(eq(orders.userId, userId));
    const data = await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt)).limit(limit).offset(offset);
    return { data, total: countRes.count };
  }

  async getOrderWithItems(userId, orderNumber) {
    const [order] = await db.select().from(orders).where(and(eq(orders.userId, userId), eq(orders.orderNumber, orderNumber))).limit(1);
    if (!order) return null;
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
    return { order, items };
  }

  async processAdminOrderStatusUpdateTransaction(orderId, newStatus, payload) {
    return await db.transaction(async (tx) => {
      const [order] = await tx.select().from(orders).where(eq(orders.id, orderId)).for('update');
      if (!order) throw new Error('ORDER_NOT_FOUND');

      const currentStatus = order.status;

      if (newStatus === 'PROCESSING') {
        if (currentStatus !== 'CONFIRMED') throw new Error('INVALID_ORDER_TRANSITION');
        await tx.update(orders).set({ status: 'PROCESSING', processedAt: new Date(), updatedAt: new Date() }).where(eq(orders.id, orderId));
      } else if (newStatus === 'SHIPPED') {
        if (currentStatus !== 'PROCESSING') throw new Error('INVALID_ORDER_TRANSITION');
        if (!payload.shippingCarrier || !payload.trackingNumber) throw new Error('SHIPPING_DATA_REQUIRED');
        
        const updateData = {
          status: 'SHIPPED',
          shippingCarrier: payload.shippingCarrier,
          trackingNumber: payload.trackingNumber,
          shippedAt: new Date(),
          updatedAt: new Date()
        };
        if (payload.trackingUrl) updateData.trackingUrl = payload.trackingUrl;
        
        await tx.update(orders).set(updateData).where(eq(orders.id, orderId));
      } else if (newStatus === 'DELIVERED') {
        if (currentStatus !== 'SHIPPED') throw new Error('INVALID_ORDER_TRANSITION');
        await tx.update(orders).set({ status: 'DELIVERED', deliveredAt: new Date(), updatedAt: new Date() }).where(eq(orders.id, orderId));
      } else {
        throw new Error('INVALID_ORDER_TRANSITION');
      }

      const [updatedOrder] = await tx.select().from(orders).where(eq(orders.id, orderId));
      return updatedOrder;
    });
  }

  async processPaidCancellationTransaction(orderId, adminId, idempotencyKey) {
    return await db.transaction(async (tx) => {
      const [order] = await tx.select().from(orders).where(eq(orders.id, orderId)).for('update');
      if (!order) throw new Error('ORDER_NOT_FOUND');
      
      const [existingRefund] = await tx.select().from(refunds).where(eq(refunds.orderId, orderId)).for('update');
      if (existingRefund) {
        return { order, refund: existingRefund, paymentAttempt: null, newlyCreated: false };
      }

      if (order.status === 'CANCELLED' || order.status === 'EXPIRED' || order.status === 'DELIVERED' || order.status === 'SHIPPED') {
        throw new Error('ORDER_CANNOT_BE_CANCELLED');
      }

      const [payment] = await tx.select().from(payments).where(eq(payments.orderId, orderId));
      if (!payment || payment.status !== 'PAID') {
        throw new Error('ORDER_NOT_PAID');
      }

      const [paymentAttempt] = await tx.select().from(paymentAttempts).where(and(
        eq(paymentAttempts.paymentId, payment.id),
        eq(paymentAttempts.status, 'CAPTURED')
      )).limit(1);

      if (!paymentAttempt) throw new Error('NO_CAPTURED_PAYMENT_ATTEMPT');
      if (paymentAttempt.amount !== order.grandTotal) throw new Error('PAYMENT_AMOUNT_MISMATCH');
      if (paymentAttempt.currency !== 'INR') throw new Error('INVALID_CURRENCY');

      const items = await tx.select().from(orderItems).where(eq(orderItems.orderId, orderId));
      const variantMap = new Map();
      items.forEach(item => {
        const qty = variantMap.get(item.variantId) || 0;
        variantMap.set(item.variantId, qty + item.quantity);
      });
      const variantIds = Array.from(variantMap.keys()).sort();
      
      if (variantIds.length > 0) {
        await tx.select().from(productVariants).where(inArray(productVariants.id, variantIds)).for('update');
        
        for (const [vId, qty] of variantMap.entries()) {
          await tx.update(productVariants)
            .set({ 
              stockOnHand: sql`${productVariants.stockOnHand} + ${qty}`,
              updatedAt: new Date()
            })
            .where(eq(productVariants.id, vId));
        }
      }

      await tx.update(orders).set({ status: 'CANCELLED', paymentStatus: 'REFUND_PENDING', updatedAt: new Date() }).where(eq(orders.id, orderId));

      const [newRefund] = await tx.insert(refunds).values({
        orderId: order.id,
        paymentId: payment.id,
        idempotencyKey: idempotencyKey,
        amount: order.grandTotal,
        currency: 'INR',
        status: 'REQUESTED',
        initiatedByUserId: adminId,
      }).returning();

      return { order: { ...order, status: 'CANCELLED', paymentStatus: 'REFUND_PENDING' }, refund: newRefund, paymentAttempt, newlyCreated: true };
    });
  }
}
