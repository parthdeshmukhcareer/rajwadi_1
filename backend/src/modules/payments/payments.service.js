import { razorpay } from '../../config/razorpay.js';
import { PaymentsRepository } from './payments.repository.js';
import { Errors } from '../../utils/Errors.js';
import { env } from '../../config/env.js';
import crypto from 'crypto';

export class PaymentsService {
  constructor() {
    this.repo = new PaymentsRepository();
  }

  async createPaymentOrder(userId, orderNumber) {
    const order = await this.repo.getOrderForPayment(orderNumber, userId);
    if (!order) throw Errors.ORDER_NOT_FOUND();
    
    if (order.status === 'EXPIRED') {
      throw Errors.ORDER_EXPIRED();
    }
    if (order.status !== 'PENDING_PAYMENT' || order.paymentStatus !== 'PENDING') {
      throw Errors.INVALID_ORDER_STATE();
    }

    // Check if payment already exists
    let payment = await this.repo.getPaymentByOrder(order.id);
    if (payment && payment.razorpayOrderId) {
      return {
        orderNumber,
        razorpayOrderId: payment.razorpayOrderId,
        amount: payment.amount,
        currency: payment.currency,
        keyId: env.RAZORPAY_KEY_ID
      };
    }

    const amount = order.grandTotal;

    // Create Razorpay Order
    let rzpOrder;
    try {
      rzpOrder = await razorpay.orders.create({
        amount,
        currency: 'INR',
        receipt: `receipt_${order.orderNumber}`
      });
    } catch (err) {
      console.error('Razorpay order creation failed:', err);
      throw Errors.RAZORPAY_ORDER_CREATION_FAILED();
    }

    // Persist Payment row
    payment = await this.repo.createRazorpayOrder({
      orderId: order.id,
      razorpayOrderId: rzpOrder.id,
      amount,
      currency: 'INR',
      status: 'CREATED'
    });

    return {
      orderNumber,
      razorpayOrderId: payment.razorpayOrderId,
      amount: payment.amount,
      currency: payment.currency,
      keyId: env.RAZORPAY_KEY_ID
    };
  }

  async verifyFrontendPayment(userId, verifyData) {
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = verifyData;

    // 1. Get our persisted payment
    const payment = await this.repo.getPaymentByRazorpayOrderId(razorpayOrderId);
    if (!payment) throw Errors.PAYMENT_NOT_FOUND();

    // 2. Ensure order belongs to user
    const order = await this.repo.getOrderById(payment.orderId);
    if (!order || order.userId !== userId) {
      throw Errors.PAYMENT_NOT_FOUND();
    }

    // 3. Verify Signature using our DB's razorpayOrderId
    const body = payment.razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto.createHmac('sha256', env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    let isValid = false;
    try {
      isValid = crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(razorpaySignature)
      );
    } catch (e) {
       isValid = false;
    }
    
    if (!isValid) {
      throw Errors.PAYMENT_VERIFICATION_FAILED('Invalid signature');
    }

    // 4. Verify Server-Side from Razorpay
    let rzpPayment;
    try {
      rzpPayment = await razorpay.payments.fetch(razorpayPaymentId);
    } catch (err) {
      throw Errors.PAYMENT_VERIFICATION_FAILED('Failed to fetch payment from Razorpay');
    }

    if (rzpPayment.status !== 'captured') {
       // Persist failed attempt
       if (rzpPayment.status === 'failed') {
         await this.repo.recordPaymentAttempt({
           paymentId: payment.id,
           orderId: order.id,
           razorpayPaymentId,
           amount: rzpPayment.amount,
           currency: rzpPayment.currency,
           status: 'FAILED',
           paymentMethod: rzpPayment.method,
           failureCode: rzpPayment.error_code,
           failureReason: rzpPayment.error_description
         });
       }
       throw Errors.PAYMENT_VERIFICATION_FAILED(`Payment status is ${rzpPayment.status}`);
    }

    if (rzpPayment.amount !== payment.amount) {
      throw Errors.PAYMENT_AMOUNT_MISMATCH();
    }
    if (rzpPayment.currency !== payment.currency) {
      throw Errors.PAYMENT_CURRENCY_MISMATCH();
    }

    // 5. Confirm Order
    const attemptData = {
      paymentId: payment.id,
      razorpayPaymentId,
      amount: rzpPayment.amount,
      currency: rzpPayment.currency,
      paymentMethod: rzpPayment.method
    };

    const res = await this.repo.confirmPaidOrderTransaction(order.id, attemptData);
    if (res.latePayment) {
       throw Errors.LATE_PAYMENT();
    }
    return { success: true, alreadyPaid: !!res.alreadyPaid };
  }

  async processWebhook(rawBody, signature, razorpayEventId) {
    // 1. Verify webhook signature
    const expectedSignature = crypto.createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');

    let isValid = false;
    try {
      isValid = crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(signature)
      );
    } catch (e) {
       isValid = false;
    }

    if (!isValid) {
      throw Errors.INVALID_WEBHOOK_SIGNATURE();
    }

    // 2. Deduplication check
    const existingEvent = await this.repo.getWebhookEvent(razorpayEventId);
    if (existingEvent && existingEvent.status === 'PROCESSED') {
      return { success: true, message: 'Already processed' };
    }

    const payload = JSON.parse(rawBody);
    const eventType = payload.event;
    const payloadHash = crypto.createHash('sha256').update(rawBody).digest('hex');

    // 3. Persist Event
    const event = await this.repo.saveWebhookEvent({
      providerEventId: razorpayEventId,
      eventType,
      payload,
      payloadHash,
      status: 'RECEIVED'
    });

    try {
      if (eventType === 'payment.captured' || eventType === 'order.paid') {
        let paymentEntity = payload.payload.payment?.entity;
        
        if (!paymentEntity && eventType === 'order.paid') {
            // order.paid might only have order entity, need to find the related payment. 
            // Usually razorpay sends payment.captured which has payment entity.
            // Let's rely on payment entity if available.
            return await this._markProcessed(razorpayEventId); // Ignore order.paid if no payment entity, handled by payment.captured
        }

        const { id: razorpayPaymentId, order_id: razorpayOrderId, amount, currency, status, method, error_code, error_description } = paymentEntity;

        const payment = await this.repo.getPaymentByRazorpayOrderId(razorpayOrderId);
        if (!payment) {
          throw new Error('Payment not found for order ID');
        }

        if (status === 'captured') {
           if (amount !== payment.amount || currency !== payment.currency) {
              throw new Error('Amount/Currency mismatch in webhook');
           }

           const attemptData = {
              paymentId: payment.id,
              razorpayPaymentId,
              amount,
              currency,
              paymentMethod: method
           };
           await this.repo.confirmPaidOrderTransaction(payment.orderId, attemptData);
        } else if (status === 'failed') {
           await this.repo.recordPaymentAttempt({
             paymentId: payment.id,
             orderId: payment.orderId,
             razorpayPaymentId,
             amount,
             currency,
             status: 'FAILED',
             paymentMethod: method,
             failureCode: error_code,
             failureReason: error_description
           });
        }
      } else if (eventType === 'payment.failed') {
          let paymentEntity = payload.payload.payment?.entity;
          if (paymentEntity) {
            const payment = await this.repo.getPaymentByRazorpayOrderId(paymentEntity.order_id);
            if (payment) {
               await this.repo.recordPaymentAttempt({
                 paymentId: payment.id,
                 orderId: payment.orderId,
                 razorpayPaymentId: paymentEntity.id,
                 amount: paymentEntity.amount,
                 currency: paymentEntity.currency,
                 status: 'FAILED',
                 paymentMethod: paymentEntity.method,
                 failureCode: paymentEntity.error_code,
                 failureReason: paymentEntity.error_description
               });
            }
          }
      } else if (eventType === 'refund.processed') {
          let refundEntity = payload.payload.refund?.entity;
          if (refundEntity) {
            await this.repo.processRefundWebhook(refundEntity, 'REFUNDED');
          }
      } else if (eventType === 'refund.failed') {
          let refundEntity = payload.payload.refund?.entity;
          if (refundEntity) {
            await this.repo.processRefundWebhook(refundEntity, 'FAILED');
          }
      }

      await this._markProcessed(razorpayEventId);
      return { success: true };
    } catch (err) {
      await this.repo.updateWebhookEventStatus(razorpayEventId, {
        status: 'FAILED',
        errorMessage: err.message ? err.message.substring(0, 250) : 'Unknown error'
      });
      throw err;
    }
  }

  async _markProcessed(razorpayEventId) {
    await this.repo.updateWebhookEventStatus(razorpayEventId, {
      status: 'PROCESSED',
      processedAt: new Date()
    });
  }
}
