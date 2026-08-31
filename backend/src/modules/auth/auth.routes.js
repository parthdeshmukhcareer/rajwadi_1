import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { UsersRepository } from '../users/users.repository.js';
import { AuthRepository } from './auth.repository.js';
import { requireAuth } from '../../middleware/auth.middleware.js';

export async function authRoutes(app) {
  const usersRepo = new UsersRepository();
  const authRepo = new AuthRepository();
  const authService = new AuthService(usersRepo, authRepo);
  const authController = new AuthController(authService);

  app.post('/register', {
    config: {
      rateLimit: {
        max: 5,
        timeWindow: '1 minute'
      }
    }
  }, authController.register);

  app.post('/login', {
    config: {
      rateLimit: {
        max: 10,
        timeWindow: '1 minute'
      }
    }
  }, authController.login);

  app.post('/refresh', {
    config: {
      rateLimit: {
        max: 10,
        timeWindow: '1 minute'
      }
    }
  }, authController.refresh);

  app.post('/logout', authController.logout);

  app.post('/google', authController.googleLogin);

  app.get('/me', { preValidation: [requireAuth] }, authController.me);
}
