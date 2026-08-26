import { buildApp } from './app.js';
import { env } from './config/env.js';

const startServer = async () => {
  try {
    const app = await buildApp();
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
    app.log.info(`🚀 Rajwadi Backend running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
