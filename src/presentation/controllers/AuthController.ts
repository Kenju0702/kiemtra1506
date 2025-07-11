import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { LoginDto } from '../dto/auth/LoginAuthDto';  // Đảm bảo import đúng DTO
import { RegisterDto } from '../dto/auth/RegisterAuthDto';  // Đảm bảo import đúng DTO
import Logger from '../../shared/utils/Logger';
import { LoginUseCase } from 'src/core/use-cases/auth/LoginUseCase';
import { RegisterUseCase } from 'src/core/use-cases/auth/RegisterUseCase';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
  ) { }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const token = await this.loginUseCase.execute(loginDto);  // pass DTO directly
      return { token };
    } catch (error) {
      Logger.error('Login failed for username: ' + loginDto.username + ' Error: ' + error.message);
      throw new HttpException('Login failed', HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      const user = await this.registerUseCase.execute(registerDto);
      return { user };
    } catch (error) {
      Logger.error('Registration failed for username: ' + registerDto.username + ' Error: ' + error.message);
      throw new HttpException('Registration failed', HttpStatus.BAD_REQUEST);
    }
  }
}

