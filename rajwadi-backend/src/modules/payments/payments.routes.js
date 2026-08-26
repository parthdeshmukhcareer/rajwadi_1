import { paymentsController } from './payments.controller.js';
import { verifyPaymentSchema } from './payments.schema.js';

export const paymentRoutes = async (fastify) => {
  fastify.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.status(401).send({ success: false, message: 'Unauthorized' });
    }
  });

  fastify.post('/orders/:orderNumber/payment', paymentsController.createPayment);
  
  fastify.post('/payments/verify', paymentsController.verifyPayment);
};
