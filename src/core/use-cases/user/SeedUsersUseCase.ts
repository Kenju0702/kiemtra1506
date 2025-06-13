import { UserRepository } from '../../interfaces/UserRepository';
import { UserRole, UserStatus } from 'src/shared/enum/enum';
import * as bcrypt from 'bcrypt';

export class SeedUsers {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<void> {
    const sampleUsers = [
      {
        name: 'John Doe',
        username: 'john.doe',
        email: 'john.doe@example.com',
        password: 'password123',
        phone: '0123456789',
        avatar: '',
        role: UserRole.STUDENT,
      },
      {
        name: 'Jane Smith',
        username: 'jane.smith',
        email: 'jane.smith@example.com',
        password: 'password456',
        phone: '0987654321',
        avatar: '',
        role: UserRole.ADMIN,
      },
    ];

    for (const user of sampleUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const newUser = {
        ...user,
        password: hashedPassword,
        status: UserStatus.ACTIVE,
        isDeleted: false,
      };

      const createdUser = await this.userRepository.create(newUser);
      console.log(`✅ Seeded user: ${createdUser.id} - ${createdUser.name}`);
    }

    console.log('🌱 Sample users seeded successfully!');
  }
}
