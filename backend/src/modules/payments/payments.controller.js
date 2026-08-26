import { PaymentsService } from './payments.service.js';
import { verifyPaymentSchema } from './payments.schema.js';

export const paymentsController = {
  async createPayment(request, reply) {
    const { orderNumber } = request.params;
    const userId = request.user.sub;

    const service = new PaymentsService();
    const result = await service.createPaymentOrder(userId, orderNumber);
    
    return reply.status(201).send({
      success: true,
      data: result
    });
  },

  async verifyPayment(request, reply) {
    const userId = request.user.sub;
    const verifyData = verifyPaymentSchema.parse(request.body);

    const service = new PaymentsService();
    const result = await service.verifyFrontendPayment(userId, verifyData);
    
    return reply.send({
      success: true,
      message: 'Payment verified and order confirmed successfully',
      data: result
    });
  },

  async handleRazorpayWebhook(request, reply) {
    const signature = request.headers['x-razorpay-signature'];
    const razorpayEventId = request.headers['x-razorpay-event-id'];
    const rawBody = request.rawBody;

    if (!signature || !razorpayEventId || !rawBody) {
      return reply.status(400).send({ success: false, message: 'Missing webhook headers or body' });
    }

    const service = new PaymentsService();
    await service.processWebhook(rawBody, signature, razorpayEventId);

    // Always return 200 OK to Razorpay if successfully processed or safely failed
    return reply.status(200).send({ success: true });
  }
};
