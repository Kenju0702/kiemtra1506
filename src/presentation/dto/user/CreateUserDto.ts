import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { UserRole, UserStatus } from 'src/shared/enum/enum';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username must be a string' })
  username: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsNotEmpty({ message: 'Phone is required' })
  @IsString({ message: 'Phone must be a string' })
  phone: string;
  @IsNotEmpty({ message: 'Avatar is required' })
  @IsString({ message: 'Avatar must be a string' })
  avatar: string;

  @IsNotEmpty({ message: 'Status is required' })
  @IsEnum(UserStatus, { message: 'Status must be active or inactive' })
  status: UserStatus;

  @IsNotEmpty({ message: 'Role is required' })
  @IsEnum(UserRole, { message: 'Role must be student or admin' })
  role: UserRole;

  @IsOptional()
  @IsBoolean({ message: 'isDeleted must be a boolean value' })
  isDeleted: boolean
}
