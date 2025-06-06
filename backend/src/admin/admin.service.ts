// src/admin/admin.service.ts
import { Injectable } from '@nestjs/common';
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
    const users = await this.userRepo.find({ relations: ['role'] });
    return users.map(user => ({
      id: user.id,
      name: user.myname,
      role: user.role?.name,
      address: user.address,
      picture: user.picture,
    }));
  }
}
