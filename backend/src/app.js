import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import { env } from './config/env.js';
import { db } from './db/index.js';
import { DomainError } from './utils/errors.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { addressRoutes } from './modules/addresses/addresses.routes.js';
import { uploadRoutes } from './modules/uploads/uploads.routes.js';
import { publicCategoryRoutes } from './modules/categories/categories.routes.js';
import { publicProductRoutes } from './modules/products/products.routes.js';
import { adminCategoryRoutes } from './modules/admin/admin.categories.routes.js';
import { adminProductRoutes } from './modules/admin/admin.products.routes.js';
import { cartRoutes } from './modules/cart/cart.routes.js';
import { adminCouponRoutes } from './modules/admin/admin.coupons.routes.js';
import { orderRoutes } from './modules/orders/orders.routes.js';
import { adminOrderRoutes } from './modules/admin/admin.orders.routes.js';
import { adminRefundRoutes } from './modules/admin/admin.refunds.routes.js';
import { adminReviewRoutes } from './modules/admin/admin.reviews.routes.js';
import { paymentRoutes } from './modules/payments/payments.routes.js';
import { webhookRoutes } from './modules/payments/webhooks.routes.js';
import { reviewsRoutes } from './modules/reviews/reviews.routes.js';
import { startOrderExpirationJob, stopOrderExpirationJob } from './jobs/orderExpiration.job.js';
import fastifyMultipart from '@fastify/multipart';
import fastifyRawBody from 'fastify-raw-body';
import { sql } from 'drizzle-orm';

export const buildApp = async () => {
  const app = Fastify({
    logger: {
      redact: [
        'req.headers.authorization', 
        'req.headers.cookie', 
        'res.headers["set-cookie"]', 
        'password', 
        'passwordHash', 
        'refreshToken', 
        'accessToken', 
        'razorpaySignature', 
        'RAZORPAY_KEY_SECRET', 
        'RAZORPAY_WEBHOOK_SECRET', 
        'DATABASE_URL'
      ]
    },
  });

  await app.register(cors, {
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
  });

  await app.register(helmet);

  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  await app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    sign: {
      expiresIn: '15m'
    }
  });

  await app.register(fastifyCookie);

  await app.register(fastifyRawBody, {
    field: 'rawBody',
    global: false,
    encoding: 'utf8',
    runFirst: true
  });

  await app.register(fastifyMultipart, {
    limits: {
      fileSize: env.MAX_IMAGE_SIZE_MB * 1024 * 1024,
    }
  });

  app.setErrorHandler((error, request, reply) => {
    if (error instanceof DomainError) {
      reply.status(error.statusCode).send({
        success: false,
        error: {
          code: error.code,
          message: error.message,
        }
      });
      return;
    }

    if (error.statusCode === 429) {
      reply.status(429).send({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests, please try again later.'
        }
      });
      return;
    }

    request.log.error(error);
    reply.status(500).send({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || 'Internal server error',
        stack: error.stack
      }
    });
  });

  app.get('/health', async () => {
    await db.execute(sql`SELECT 1`);
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  app.register(authRoutes, { prefix: '/api/v1/auth' });
  app.register(addressRoutes, { prefix: '/api/v1/addresses' });
  app.register(uploadRoutes, { prefix: '/api/v1/admin/uploads' });
  app.register(publicCategoryRoutes, { prefix: '/api/v1/categories' });
  app.register(publicProductRoutes, { prefix: '/api/v1/products' });
  app.register(adminCategoryRoutes, { prefix: '/api/v1/admin/categories' });
  app.register(adminProductRoutes, { prefix: '/api/v1/admin/products' });
  app.register(cartRoutes, { prefix: '/api/v1/cart' });
  app.register(adminCouponRoutes, { prefix: '/api/v1/admin/coupons' });
  app.register(orderRoutes, { prefix: '/api/v1/orders' });
  app.register(adminOrderRoutes, { prefix: '/api/v1/admin/orders' });
  app.register(adminRefundRoutes, { prefix: '/api/v1/admin/refunds' });
  app.register(adminReviewRoutes, { prefix: '/api/v1/admin/reviews' });
  app.register(reviewsRoutes, { prefix: '/api/v1/products' });
  app.register(paymentRoutes, { prefix: '/api/v1' });
  app.register(webhookRoutes, { prefix: '/api/v1/webhooks' });

  app.addHook('onReady', async function () {
    startOrderExpirationJob();
  });

  app.addHook('onClose', async function () {
    stopOrderExpirationJob();
  });

  return app;
};
