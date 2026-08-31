import { Resend } from 'resend';
import { db } from '../db/index.js';
import { emailLogs } from '../db/schema/index.js';
import { eq, and } from 'drizzle-orm';
import { env } from '../config/env.js';
import { orderConfirmationTemplate } from '../templates/order-confirmation-email.js';

export class EmailService {
  constructor() {
    this.resend = new Resend(env.RESEND_API_KEY);
    this.fromEmail = env.EMAIL_FROM || 'Rajwadi <no-reply@rajwadi.com>';
  }

  async sendOrderConfirmation(order, user, orderItems, shippingAddress) {
    const emailType = 'ORDER_CONFIRMED';
    
    // Deduplication check
    const existingLog = await db.select().from(emailLogs)
      .where(and(
        eq(emailLogs.orderId, order.id),
        eq(emailLogs.emailType, emailType),
        eq(emailLogs.status, 'SENT')
      )).limit(1);

    if (existingLog.length > 0) {
      console.log(`Order confirmation email already sent for order ${order.orderNumber}`);
      return;
    }

    const items = orderItems.map(item => ({
      name: item.productName,
      quantity: item.quantity,
      price: item.price,
      size: item.size
    }));

    const trackOrderUrl = `${env.FRONTEND_URL}/account/orders/${order.orderNumber}`;
    const subject = `Your Rajwadi Order is Confirmed — ${order.orderNumber}`;

    const html = orderConfirmationTemplate({
      customerName: user.firstName,
      orderNumber: order.orderNumber,
      orderDate: new Date(order.createdAt).toLocaleDateString(),
      items,
      totalAmount: order.grandTotal,
      shippingAddress,
      trackOrderUrl
    });

    const text = `Dear ${user.firstName},\n\nYour order ${order.orderNumber} is confirmed.\nTrack your order here: ${trackOrderUrl}`;

    return this.sendEmail({
      to: user.email,
      subject,
      html,
      text,
      userId: user.id,
      orderId: order.id,
      emailType
    });
  }

  async sendEmail({ to, subject, html, text, userId, orderId, emailType }) {
    // 1. Create PENDING log
    const [log] = await db.insert(emailLogs).values({
      userId,
      orderId,
      emailTo: to,
      emailType,
      subject,
      status: 'PENDING',
      provider: 'resend'
    }).returning();

    try {
      // 2. Send via Resend (skip if test)
      let data;
      if (process.env.NODE_ENV === 'test') {
        data = { data: { id: 'test_email_message_id_fallback' } };
      } else {
        data = await this.resend.emails.send({
          from: this.fromEmail,
          to,
          subject,
          html,
          text
        });
      }

      if (data.error) {
        throw new Error(data.error.message || 'Unknown Resend error');
      }

      // 3. Update log to SENT
      await db.update(emailLogs).set({
        status: 'SENT',
        providerMessageId: data.data.id,
        sentAt: new Date()
      }).where(eq(emailLogs.id, log.id));

      return { success: true, messageId: data.data.id };
    } catch (err) {
      console.error(`Email sending failed for log ${log.id}:`, err);
      
      // 4. Update log to FAILED
      await db.update(emailLogs).set({
        status: 'FAILED',
        errorMessage: err.message ? err.message.substring(0, 250) : 'Failed to send'
      }).where(eq(emailLogs.id, log.id));
      
      return { success: false, error: err.message };
    }
  }
}

export const emailService = new EmailService();
