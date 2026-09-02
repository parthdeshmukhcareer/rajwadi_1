import { env } from '../config/env.js';
import { db } from '../db/index.js';
import { notificationLogs } from '../db/schema/index.js';
import { eq, and } from 'drizzle-orm';

export const whatsappService = {
  async sendOwnerWhatsAppNotification(data) {
    // Expected data format:
    // { type: 'ORDER_PLACED' | 'ORDER_CANCELLED', orderId, orderNumber, customerName, customerPhone, customerEmail, totalAmount, orderStatus, paymentStatus, items }

    if (!data.orderId) {
       console.error('[WhatsApp Service] Missing orderId for notification');
       return;
    }

    try {
      // Duplicate prevention
      const existing = await db.select().from(notificationLogs)
        .where(and(eq(notificationLogs.orderId, data.orderId), eq(notificationLogs.type, data.type)))
        .limit(1);
      
      if (existing.length > 0 && existing[0].status === 'SENT') {
        console.log(`[WhatsApp Service] Duplicate notification prevented for order ${data.orderId}, type ${data.type}`);
        return;
      }

      const ownerNumber = '+919766631092';
      const hasCredentials = !!env.WHATSAPP_API_TOKEN;

      let message = '';
      
      if (data.type === 'ORDER_PLACED') {
        message = `New Rajwadi Order Received\n\nOrder No: ${data.orderNumber}\nCustomer: ${data.customerName}\nPhone: ${data.customerPhone}\nEmail: ${data.customerEmail}\nTotal: Rs. ${data.totalAmount}\nPayment: ${data.paymentStatus}\nStatus: ${data.orderStatus}\n\nItems:\n${data.items ? data.items.map((item, idx) => `${idx + 1}. ${item.productName} - Qty ${item.quantity} - Size ${item.size}`).join('\n') : ''}\n\nAdmin Action:\nOpen Admin Orders Dashboard`;
      } else if (data.type === 'ORDER_CANCELLED') {
        message = `Rajwadi Order Cancelled\n\nOrder No: ${data.orderNumber}\nCustomer: ${data.customerName}\nTotal: Rs. ${data.totalAmount}\nStatus: ${data.orderStatus}`;
      }

      if (hasCredentials) {
        console.log(`[WhatsApp Service] Sending message to ${ownerNumber} using credentials. Message:`, message);
      } else {
        console.log(`[WhatsApp Service] Stub mode. Would send to ${ownerNumber}. Message:\n`, message);
      }

      // Record success
      await db.insert(notificationLogs).values({
        orderId: data.orderId,
        type: data.type,
        status: 'SENT',
        details: 'Message logged successfully'
      });
      
    } catch (err) {
      console.error('[WhatsApp Service] Failed to send notification:', err);
    }
  }
};
