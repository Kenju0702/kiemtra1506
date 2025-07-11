import { UserRepository } from '../../interfaces/UserRepository';
import { User } from '../../entities/User';
import { Logger } from '@nestjs/common';

export class CreateUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userData: Omit<User, 'id'>): Promise<User> {

    const existingUser = await this.userRepository.findByEmail(userData.email);
    const existingUsername = await this.userRepository.findByUsername(userData.username);
    const existingPhone = await this.userRepository.findByPhone(userData.phone);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    if (existingUsername) {
      throw new Error('Username already exists');
    }

    if (existingPhone) {
      throw new Error('Phone already exists');
    }

    if (!userData.password) {
      throw new Error('Password is required');
    }
    if (!userData.name) {
      throw new Error('Name is required');
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
      return createdUser;
    } catch (error) {
      Logger.error('Error creating user: ' + error.message);
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }
}
