// src/admin/admin.service.ts
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getAllUsers() {
    const users = await this.userRepo.find({
      relations: ['role'],
      order: {
        id: 'ASC',
      },
    });
    return users.map(user => ({
      id: user.id,
      name: user.myname,
      role: user.role?.name,
      address: user.address,
      picture: user.picture,
    }));
  }

  async deleteUser(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepo.remove(user);
    return { status: 'success', message: 'User deleted successfully' };
  }
}

