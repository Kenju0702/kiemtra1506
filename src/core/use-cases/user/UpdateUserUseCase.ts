import { UserRepository } from '../../interfaces/UserRepository'
import { User } from '../../entities/User'
import * as bcrypt from 'bcrypt'

export class UpdateUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string, user: Partial<User>): Promise<User | null> {
    // Kiểm tra xem người dùng có tồn tại không
    const existingUser = await this.userRepository.findById(id)
    if (!existingUser) {
      throw new Error('User not found')
    }

    // Không cho phép cập nhật username
    if (user.username) {
      throw new Error('Username cannot be updated')
    }

    // Nếu có cập nhật password thì băm trước khi lưu
    if (user.password) {
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(user.password, salt)
    }

    // Bỏ field id nếu có truyền nhầm
    const { id: _, ...safeUser } = user

    // Cập nhật vào repository
    const updatedUser = await this.userRepository.update(id, safeUser)
    return updatedUser
  }
}
