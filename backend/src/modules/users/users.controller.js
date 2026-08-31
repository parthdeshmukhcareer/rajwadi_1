import { updateProfileSchema } from './users.schema.js';
import { Errors } from '../../utils/errors.js';

export class UsersController {
  constructor(usersService) {
    this.usersService = usersService;
  }

  updateProfile = async (req, reply) => {
    const userId = req.user.sub;
    
    const result = updateProfileSchema.safeParse(req.body);
    if (!result.success) {
      throw Errors.VALIDATION_ERROR(result.error.issues[0].message);
    }

    const updatedUser = await this.usersService.updateProfile(userId, result.data);

    return reply.send({
      success: true,
      data: updatedUser
    });
  }
}
