import { db } from '../../db/index.js';
import { settings } from '../../db/schema/index.js';
import { eq, inArray } from 'drizzle-orm';
import { seedSettings } from '../../db/schema/seedSettings.js';

export class AdminSettingsService {
  constructor() {
    this.cache = null;
    this.cacheTimestamp = 0;
    this.CACHE_TTL_MS = 60000; // 60 seconds
  }

  async getAllSettings() {
    const now = Date.now();
    if (this.cache && (now - this.cacheTimestamp < this.CACHE_TTL_MS)) {
      return this.cache;
    }

    // Ensure seeded
    await seedSettings();
    const allSettings = await db.select().from(settings);
    // Convert array to object
    const settingsObj = allSettings.reduce((acc, curr) => {
      acc[curr.key] = curr.type === 'number' ? Number(curr.value) : curr.value;
      return acc;
    }, {});

    this.cache = settingsObj;
    this.cacheTimestamp = now;

    return settingsObj;
  }

  async updateSettings(settingsObj) {
    // Extract only keys that exist in our schema to prevent random insertion
    const keys = Object.keys(settingsObj);
    const existingSettings = await db.select().from(settings).where(inArray(settings.key, keys));
    const validKeys = existingSettings.map(s => s.key);

    const result = await db.transaction(async (tx) => {
      for (const [key, value] of Object.entries(settingsObj)) {
        if (validKeys.includes(key)) {
          await tx.update(settings).set({ value: String(value), updatedAt: new Date() }).where(eq(settings.key, key));
        }
      }
      return true;
    });

    // Invalidate cache immediately on update
    this.cache = null;
    this.cacheTimestamp = 0;

    return result;
  }
}

export const adminSettingsService = new AdminSettingsService();
