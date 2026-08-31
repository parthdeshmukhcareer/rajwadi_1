import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';
import { UsersRepository } from './users.repository.js';
import { requireAuth } from '../../middleware/auth.middleware.js';

export async function userRoutes(app) {
  const usersRepo = new UsersRepository();
  const usersService = new UsersService(usersRepo);
  const usersController = new UsersController(usersService);

  app.patch('/profile', { preValidation: [requireAuth] }, usersController.updateProfile);
}
