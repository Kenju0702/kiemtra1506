import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../../interfaces/UserRepository';
import { LoginDto } from '../../../presentation/dto/auth/LoginAuthDto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';  // Import JwtService


@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,  // Inject JwtService
  ) {}

  async execute(loginDto: LoginDto): Promise<string> {
    const user = await this.userRepository.findByUsername(loginDto.username);
    if (!user) {
      Logger.warn(`User not found with username: ${loginDto.username}`);
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      Logger.warn(`Invalid password attempt for username: ${loginDto.username}`);
      throw new Error('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
    return token;  
  }
}
