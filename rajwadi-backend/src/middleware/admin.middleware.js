import { Errors } from '../utils/errors.js';
import { UsersRepository } from '../modules/users/users.repository.js';

export const requireAdmin = async (req, reply) => {
  const jwtUser = req.user;
  
  // Check JWT claim first
  if (!jwtUser || jwtUser.role !== 'ADMIN') {
    throw Errors.FORBIDDEN();
  }

  // Re-verify from DB to ensure user is still active and hasn't been demoted
  const usersRepo = new UsersRepository();
  const dbUser = await usersRepo.findById(jwtUser.sub);
  
  if (!dbUser || !dbUser.isActive || dbUser.role !== 'ADMIN') {
    throw Errors.FORBIDDEN();
  }
};
