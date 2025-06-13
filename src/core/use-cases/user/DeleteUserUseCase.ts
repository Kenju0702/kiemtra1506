import { UserRepository } from '../../interfaces/UserRepository'
import { User } from '../../entities/User'

export class DeleteUser {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string): Promise<User | null> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
        throw new Error('User not found');
    }

    const updatedUser = await this.userRepository.delete(id);
    return updatedUser;
  }
}