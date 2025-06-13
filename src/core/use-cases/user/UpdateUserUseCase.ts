import { UserRepository } from '../../interfaces/UserRepository'
import { User } from '../../entities/User'
import * as bcrypt from 'bcrypt'

export class UpdateUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string, user: Partial<User>): Promise<User | null> {
    const existingUser = await this.userRepository.findById(id)
    if (!existingUser) {
      throw new Error('User not found')
    }

    if (user.username) {
      throw new Error('Username cannot be updated')
    }

    if (user.password) {
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(user.password, salt)
    }

    const { id: _, ...safeUser } = user
    const updatedUser = await this.userRepository.update(id, safeUser)
    return updatedUser
  }
}
