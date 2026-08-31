import { UsersRepository } from '../users/users.repository.js';
import { DomainError } from '../../utils/errors.js';

export class AdminCustomersController {
  constructor() {
    this.usersRepo = new UsersRepository();
  }

  getCustomers = async (request, reply) => {
    try {
      const { page = 1, limit = 10, search = '' } = request.query;
      const result = await this.usersRepo.getAdminCustomers({ 
        page: parseInt(page), 
        limit: parseInt(limit), 
        search 
      });
      
      return reply.send({
        success: true,
        data: result.data,
        pagination: {
          total: result.total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(result.total / limit)
        }
      });
    } catch (error) {
      throw new DomainError('Failed to fetch customers', 'FETCH_CUSTOMERS_FAILED', 500);
    }
  };
}
