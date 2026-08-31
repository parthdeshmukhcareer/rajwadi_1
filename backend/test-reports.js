import { buildApp } from './src/app.js';
import { db } from './src/db/index.js';
import { AdminReportsService } from './src/modules/admin/admin.reports.service.js';

async function run() {
  const app = await buildApp();
  await app.ready();
  
  const service = new AdminReportsService();
  try {
    const report = await service.getSalesReport({ range: 'last_30_days' });
    console.log("Success!");
    process.exit(0);
  } catch (error) {
    console.error("FAILED!", error);
    process.exit(1);
  }
}

run();
