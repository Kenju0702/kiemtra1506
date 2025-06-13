import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../../interfaces/UserRepository';
import { LoginDto } from '../../../presentation/dto/auth/LoginAuthDto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';  // Import JwtService
import { log } from 'console';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,  // Inject JwtService
  ) {}

  async execute(loginDto: LoginDto): Promise<string> {
    // Tìm người dùng qua username
    const user = await this.userRepository.findByUsername(loginDto.username);
    Logger.log(`Login attempt with username: ${loginDto.username}`);
    Logger.log(`Login attempt with password: ${loginDto.password}`);
    // Kiểm tra xem người dùng có tồn tại không
    if (!user) {
      Logger.warn(`User not found with username: ${loginDto.username}`);
      throw new Error('Invalid credentials');
    }
    Logger.log(`User found: ${JSON.stringify(user)}`);
    // Kiểm tra mật khẩu nhập vào so với mật khẩu đã băm trong cơ sở dữ liệu
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      Logger.warn(`Invalid password attempt for username: ${loginDto.username}`);
      throw new Error('Invalid credentials');
    }

    // Tạo JWT token với payload (thông tin cần thiết trong token)
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
    Logger.log(`payload: ${JSON.stringify(payload)}`);
    Logger.log(`Token created: ${token}`);
    return token;  // Trả về token đã tạo
  }
}
