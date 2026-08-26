import { defineConfig } from 'drizzle-kit';
import { env } from './src/config/env.js';

export default defineConfig({
  schema: './src/db/schema/index.js',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_DIRECT_URL?.startsWith('postgres') ? env.DATABASE_DIRECT_URL : env.DATABASE_URL,
  },
});
