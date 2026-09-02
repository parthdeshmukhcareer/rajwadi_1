import { UploadsController } from './uploads.controller.js';
import { UploadsService } from './uploads.service.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { requireAdmin } from '../../middleware/admin.middleware.js';

export async function uploadRoutes(app) {
  const service = new UploadsService();
  const controller = new UploadsController(service);

  app.addHook('preValidation', requireAuth);
  app.addHook('preValidation', requireAdmin);

  app.post('/products/:productId', controller.uploadImage);
  app.post('/image', controller.uploadGenericImage);
  app.delete('/images/:id', controller.deleteImage);
}
