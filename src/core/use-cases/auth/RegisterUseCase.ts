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

    // Kiểm tra username đã tồn tại
    const existingUsername = await this.userRepository.findByUsername(username);
    if (existingUsername) {
      this.logger.warn(`Username already exists: ${username}`);
      throw new Error('Username is already taken');
    }

    // Kiểm tra email đã tồn tại
    const existingEmail = await this.userRepository.findByEmail(email);
    if (existingEmail) {
      this.logger.warn(`Email already exists: ${email}`);
      throw new Error('Email is already registered');
    }

    // Kiểm tra phone đã tồn tại
    const existingPhone = await this.userRepository.findByPhone?.(phone); // Nếu bạn có phương thức này
    if (existingPhone) {
      this.logger.warn(`Phone already exists: ${phone}`);
      throw new Error('Phone number is already in use');
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const newUser: Omit<User, 'id'> = {
      name,
      email,
      username,
      password: hashedPassword,
      phone,
      avatar,
      role: UserRole.STUDENT,
      status: UserStatus.ACTIVE,
      isDeleted: false,
    };

    return await this.userRepository.create(newUser);
  }
}

