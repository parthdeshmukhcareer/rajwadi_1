import { OrdersRepository } from '../modules/orders/orders.repository.js';
import { env } from '../config/env.js';

let intervalId = null;
let isRunning = false;

export function startOrderExpirationJob() {
  if (intervalId || process.env.DISABLE_JOBS === 'true') return; // already started or disabled for tests

  const repo = new OrdersRepository();

  intervalId = setInterval(async () => {
    if (isRunning) return; // Prevent overlap
    isRunning = true;
    try {
      const expiredOrders = await repo.getExpiredPendingOrders();
      for (const order of expiredOrders) {
        try {
          await repo.processOrderExpirationTransaction(order.id);
        } catch (err) {
          console.error(`Error expiring order ${order.id}:`, err);
        }
      }
    } catch (error) {
      console.error('Order expiration job error:', error);
    } finally {
      isRunning = false;
    }
  }, env.ORDER_EXPIRATION_INTERVAL_MS);
}

export function stopOrderExpirationJob() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}
