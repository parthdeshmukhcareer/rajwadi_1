import { z } from 'zod';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  DATABASE_URL: z.string(),
  DATABASE_DIRECT_URL: z.string().optional(),
  JWT_SECRET: z.string().min(32).default('super-secret-jwt-key-change-me-in-production-now'),
  CLOUDINARY_CLOUD_NAME: z.string().default('your-cloud-name'),
  CLOUDINARY_API_KEY: z.string().default('your-api-key'),
  CLOUDINARY_API_SECRET: z.string().default('your-api-secret'),
  MAX_PRODUCT_IMAGES: z.string().transform(Number).default('5'),
  MAX_IMAGE_SIZE_MB: z.string().transform(Number).default('5'),
  ORDER_EXPIRATION_MINUTES: z.string().transform(Number).default('15'),
  ORDER_EXPIRATION_INTERVAL_MS: z.string().transform(Number).default('60000'),
  FREE_SHIPPING_THRESHOLD: z.string().transform(Number).default('2999'), // 2999 Rupees
  DEFAULT_SHIPPING_FEE: z.string().transform(Number).default('99'), // 99 Rupees
  RAZORPAY_KEY_ID: z.string().default('rzp_test_dummykey'),
  RAZORPAY_KEY_SECRET: z.string().default('dummysecret'),
  RAZORPAY_WEBHOOK_SECRET: z.string().default('dummywebhooksecret'),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
