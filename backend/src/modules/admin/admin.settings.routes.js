import { adminSettingsController } from './admin.settings.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireAdmin } from '../../middleware/admin.middleware.js';

export async function adminSettingsRoutes(app) {
  app.addHook('preValidation', requireAuth);
  app.addHook('preValidation', requireAdmin);

  app.get('/', adminSettingsController.getSettings);
  app.patch('/', adminSettingsController.updateSettings);
}
