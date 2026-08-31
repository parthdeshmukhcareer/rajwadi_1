import { Errors } from '../../utils/errors.js';

export class UsersService {
  constructor(usersRepository) {
    this.usersRepo = usersRepository;
  }

  async updateProfile(userId, updateData) {
    const user = await this.usersRepo.findById(userId);
    if (!user) {
      throw Errors.NOT_FOUND('User not found');
    }

    // Clean up empty string values back to null for DB optional fields
    const dataToUpdate = { ...updateData };
    if (dataToUpdate.phone === '') dataToUpdate.phone = null;
    if (dataToUpdate.gender === '') dataToUpdate.gender = null;
    if (dataToUpdate.dateOfBirth === '') dataToUpdate.dateOfBirth = null;

    const updatedUser = await this.usersRepo.update(userId, dataToUpdate);

    // Sanitize output
    const { passwordHash, ...sanitizedUser } = updatedUser;
    return sanitizedUser;
  }
}
