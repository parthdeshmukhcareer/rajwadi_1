import { paymentsController } from './payments.controller.js';

export const webhookRoutes = async (fastify) => {
  // fastify-raw-body must be registered globally or for this route
  // We registered it in app.js with global: false, so we need to enable it here
  fastify.post('/razorpay', {
    config: { rawBody: true }
  }, paymentsController.handleRazorpayWebhook);
};
