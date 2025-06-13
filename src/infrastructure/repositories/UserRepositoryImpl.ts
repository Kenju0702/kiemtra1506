import { UserRepository } from '../../core/interfaces/UserRepository';
import { User } from '../../core/entities/User';
import UserModel from '../databases/UserModel';
import * as bcrypt from 'bcrypt';
import { SearchUserDto } from '../../presentation/dto/user/SearchUserDto';
import Logger from '../../shared/utils/Logger'; // Import Logger

export class UserRepositoryImpl implements UserRepository {
  async findAll(): Promise<User[]> {
    try {
      // Lấy tất cả người dùng từ cơ sở dữ liệu
      const users = await UserModel.find();
      return users.map(user =>
        new User(
          user._id.toString(), // Convert ObjectId to string
          user.name,
          user.username,
          user.email,
          user.password,
          user.phone,
          user.avatar,
          user.status as 'active' | 'inactive',
          user.role as 'student' | 'admin',
          user.isDeleted ?? false
        ),
      );
    } catch (error) {
      Logger.error(`Error in findAll method: ${error.message}\n${error.stack}`);
      throw new Error('Failed to retrieve users');  // Lỗi nội bộ, không cần thông báo HTTP error
    }
  }

  async createSampleUsers() {
    try {
      const sampleUsers = [
        { name: 'John Doe', email: 'john.doe@example.com', password: 'password123', role: 'student' },
        { name: 'Jane Smith', email: 'jane.smith@example.com', password: 'password456', role: 'instructor' },
      ];

      // Thử dùng insertOne thay vì insertMany
      for (const user of sampleUsers) {
        await UserModel.create(user);
      }
    } catch (error) {
      Logger.error(`Error in createSampleUsers method: ${error.message}\n${error.stack}`);
      throw new Error('Failed to create sample users');
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const user = await UserModel.findById(id);
      if (!user) {
        Logger.warn(`User with id ${id} not found`);
        return null;
      }
      return new User(
        user._id.toString(), // Convert ObjectId to string
        user.name,
        user.username,
        user.email,
        user.password,
        user.phone,
        user.avatar,
        user.status as 'active' | 'inactive',
        user.role as 'student' | 'admin',
        user.isDeleted ?? false
      );
    } catch (error) {
      Logger.error(`Error finding user by id: ${error.message}\n${error.stack}`);
      return null;  // Không ném lỗi, trả về null hoặc thông báo lỗi tùy ý
    }
  }

  async search(query: SearchUserDto): Promise<any> {
    try {
      const {
        id,
        email,
        phone,
        status,
        username,
        avatar,
        name,
        role,
        isDeleted,
        page = '1',
        limit = '10',
        sortBy = 'createdAt',
        order = 'desc',
      } = query;

      const pageNumber = Number(page);
      const limitNumber = Number(limit);

      const filter: any = {};

      if (id) filter._id = id;
      if (email) filter.email = { $regex: email, $options: 'i' };
      if (name) filter.name = { $regex: name, $options: 'i' };
      if (username) filter.username = { $regex: username, $options: 'i' };
      if (phone) filter.phone = { $regex: phone, $options: 'i' };
      if (role) filter.role = role;
      if (isDeleted !== undefined) filter.isDeleted = isDeleted;

      const skip = (pageNumber - 1) * limitNumber;
      const sort: any = {};
      sort[sortBy] = order === 'asc' ? 1 : -1;

      const totalCount = await UserModel.countDocuments(filter);
      const totalPages = Math.ceil(totalCount / limitNumber);

      const results = await UserModel.find(filter)
        .skip(skip)
        .limit(limitNumber)
        .sort(sort)
        .select('name username email role isDeleted'); // Chọn các trường cần thiết

      return {
        totalCount,
        totalPages,
        page: pageNumber,
        limit: limitNumber,
        data: results.map(user =>
          new User(
            user._id.toString(),
            user.name,
            user.username,
            user.email,
            user.password,
            user.phone,
            user.avatar,
            user.status as 'active' | 'inactive',
            user.role as 'student' | 'admin',
            user.isDeleted ?? false
          ),
        ),
      };
    } catch (error) {
      Logger.error(`Error in search method: ${error.message}\n${error.stack}`);
      throw new Error('Failed to search users');
    }
  }


  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await UserModel.findOne({ email })
        .select('email password name role isDeleted');

      if (!user) {
        Logger.warn(`User with email ${email} not found.`);
        return null;
      }

      // Chuyển đổi Document thành User
      return new User(
        user._id.toString(),
        user.name,
        user.username,
        user.email,
        user.password,
        user.phone,
        user.avatar,
        user.status as 'active' | 'inactive',
        user.role as 'student' | 'admin',
        user.isDeleted ?? false
      );
    } catch (error) {
      Logger.error(`Error finding user by email: ${error.message}\n${error.stack}`);
      return null;
    }
  }

  async findByPhone(phone: string): Promise<User | null> {
    try {
      const user = await UserModel.findOne({ phone })
        .select('email password name role isDeleted');

      if (!user) {
        Logger.warn(`User with phone ${phone} not found.`);
        return null;
      }
      return new User(
        user._id.toString(),
        user.name,
        user.username,
        user.email,
        user.password,
        user.phone,
        user.avatar,
        user.status as 'active' | 'inactive',
        user.role as 'student' | 'admin',
        user.isDeleted ?? false
      );
    } catch (error) {
      Logger.error(`Error finding user by email: ${error.message}\n${error.stack}`);
      return null;
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    try {
      const user = await UserModel.findOne({ username })
        .select('email password name role isDeleted');

      if (!user) {
        Logger.warn(`User with username ${username} not found.`);
        return null;
      }
      return new User(
        user._id.toString(),
        user.name,
        user.username,
        user.email,
        user.password,
        user.phone,
        user.avatar,
        user.status as 'active' | 'inactive',
        user.role as 'student' | 'admin',
        user.isDeleted ?? false
      );
    } catch (error) {
      Logger.error(`Error finding user by email: ${error.message}\n${error.stack}`);
      return null;
    }
  }

  async create(user: Omit<User, 'id'>): Promise<User> {
    try {
      const createdUser = await UserModel.create({
        ...user,
      });

      return new User(
        createdUser._id.toString(),
        createdUser.name,
        createdUser.username,
        createdUser.email,
        createdUser.password,
        createdUser.phone,
        createdUser.avatar,
        createdUser.status,
        createdUser.role,
        createdUser.isDeleted || false,
      );
    } catch (error) {
      Logger.error(`Error creating user: ${error.message}\n${error.stack}`);
      throw new Error('Failed to create user');
    }
  }


  async update(id: string, user: Partial<User>): Promise<User | null> {
    try {
    
      const updatedUser = await UserModel.findByIdAndUpdate(id, user, { new: true });

      if (!updatedUser) return null;

      return new User(
        updatedUser._id.toString(),
        updatedUser.name,
        updatedUser.username,
        updatedUser.email,
        updatedUser.password,
        updatedUser.phone,
        updatedUser.avatar,
        updatedUser.status,
        updatedUser.role,
        updatedUser.isDeleted ?? false
      );
    } catch (error) {
      Logger.error(`Error updating user: ${error.message}\n${error.stack}`);
      throw new Error('Failed to update user');
    }
  }


  async delete(id: string): Promise<User | null> {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true },
      );

      if (!updatedUser) return null;

      return new User(
        updatedUser._id.toString(),
        updatedUser.name,
        updatedUser.username,
        updatedUser.email,
        updatedUser.password,
        updatedUser.phone,
        updatedUser.avatar,
        updatedUser.status,
        updatedUser.role,
        updatedUser.isDeleted === true,
      );
    } catch (error) {
      Logger.error(`Error deleting user: ${error.message}\n${error.stack}`);
      throw new Error('Failed to delete user');
    }
  }
}