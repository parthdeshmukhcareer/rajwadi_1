import { adminSettingsService } from './admin.settings.service.js';
import { z } from 'zod';

const updateSettingsSchema = z.object({
  settings: z.object({
    storeName: z.string().min(2).optional(),
    supportEmail: z.string().email().optional(),
    supportPhone: z.string().min(5).optional(),
    defaultShippingFee: z.number().int().min(0).optional(),
    freeShippingThreshold: z.number().int().min(0).optional(),
  }).strict() // reject unknown dangerous keys
});

export class AdminSettingsController {
  async getSettings(req, reply) {
    const settings = await adminSettingsService.getAllSettings();
    return reply.send({ success: true, data: settings });
  }

  async updateSettings(req, reply) {
    const { settings } = updateSettingsSchema.parse(req.body);
    await adminSettingsService.updateSettings(settings);
    const updatedSettings = await adminSettingsService.getAllSettings();
    return reply.send({ success: true, message: 'Settings updated successfully', data: updatedSettings });
  }
}

export const adminSettingsController = new AdminSettingsController();
