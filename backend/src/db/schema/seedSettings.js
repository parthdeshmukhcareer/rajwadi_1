import { db } from '../index.js';
import { settings } from './index.js';
import { eq } from 'drizzle-orm';

const defaultSettings = [
  { key: 'storeName', value: 'Rajwadi', type: 'string', group: 'store', label: 'Store Name', description: 'The name of your store displayed to customers.', isPublic: true },
  { key: 'supportEmail', value: 'support@rajwadi.com', type: 'string', group: 'store', label: 'Support Email', description: 'Customer support contact email.', isPublic: true },
  { key: 'supportPhone', value: '+91 9999999999', type: 'string', group: 'store', label: 'Support Phone', description: 'Customer support contact phone.', isPublic: true },
  { key: 'defaultShippingFee', value: '9900', type: 'number', group: 'shipping', label: 'Default Shipping Fee (₹)', description: 'Default shipping fee in rupees (stored in paise).', isPublic: true },
  { key: 'freeShippingThreshold', value: '99900', type: 'number', group: 'shipping', label: 'Free Shipping Threshold (₹)', description: 'Order amount above which shipping is free.', isPublic: true },
];

export async function seedSettings() {
  for (const setting of defaultSettings) {
    const [existing] = await db.select().from(settings).where(eq(settings.key, setting.key)).limit(1);
    if (!existing) {
      await db.insert(settings).values(setting);
      console.log(`Seeded setting: ${setting.key}`);
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedSettings().then(() => {
    console.log('Settings seeding completed.');
    process.exit(0);
  }).catch(e => {
    console.error(e);
    process.exit(1);
  });
}
