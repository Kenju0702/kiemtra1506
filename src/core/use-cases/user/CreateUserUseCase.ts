import { UserRepository } from '../../interfaces/UserRepository';
import { User } from '../../entities/User';
import { Logger } from '@nestjs/common';

export class CreateUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userData: Omit<User, 'id'>): Promise<User> {
    Logger.log(`Checking if email exists: ${userData.email}`);
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Kiểm tra các field bắt buộc
    if (!userData.password) {
      throw new Error('Password is required');
    }

    if (!userData.username) {
      throw new Error('Username is required');
    }

    if (!userData.phone) {
      throw new Error('Phone is required');
    }

    if (!userData.avatar) {
      throw new Error('Avatar is required');
    }

    if (!userData.status) {
      throw new Error('Status is required');
    }

    if (!userData.role) {
      throw new Error('Role is required');
    }

    const newUser: Omit<User, 'id'> = {
      name: userData.name,
      username: userData.username,
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
      avatar: userData.avatar,
      status: userData.status,
      role: userData.role,
      isDeleted: userData.isDeleted ?? false,
    };

    try {
      const createdUser = await this.userRepository.create(newUser);
      Logger.log(`User created with ID: ${createdUser.id}`);
      return createdUser;
    } catch (error) {
      Logger.error('Error creating user: ' + error.message);
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }
}
