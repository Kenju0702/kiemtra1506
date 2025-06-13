import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../../interfaces/UserRepository';
import { RegisterDto } from '../../../presentation/dto/auth/RegisterAuthDto';
import { User } from '../../entities/User';
import * as bcrypt from 'bcrypt';
import { UserRole, UserStatus } from 'src/shared/enum/enum';

@Injectable()
export class RegisterUseCase {
  private readonly logger = new Logger(RegisterUseCase.name);

  constructor(private readonly userRepository: UserRepository) {}

  async execute(registerDto: RegisterDto): Promise<User> {
    const { name, email, password, phone, avatar, username } = registerDto;

    // Hash password

    // Tạo người dùng mới với các giá trị mặc định an toàn
    const newUser: Omit<User, 'id'> = {
      name,
      email,
      username,
      password,
      phone,
      avatar,
      role: UserRole.STUDENT,
      status: UserStatus.ACTIVE,
      isDeleted: false,
    };

    this.logger.log(`Registering new user: ${email}`);

    // Lưu vào DB
    const createdUser = await this.userRepository.create(newUser);
    return createdUser;
  }
}
