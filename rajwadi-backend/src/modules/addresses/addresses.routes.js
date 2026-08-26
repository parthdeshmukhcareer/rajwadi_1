import { AddressesController } from './addresses.controller.js';
import { AddressesService } from './addresses.service.js';
import { AddressesRepository } from './addresses.repository.js';
import { requireAuth } from '../../middleware/auth.middleware.js';

export async function addressRoutes(app) {
  const repo = new AddressesRepository();
  const service = new AddressesService(repo);
  const controller = new AddressesController(service);

  app.addHook('preValidation', requireAuth);

  app.get('/', controller.getAll);
  app.post('/', controller.create);
  app.patch('/:id', controller.update);
  app.delete('/:id', controller.delete);
}
