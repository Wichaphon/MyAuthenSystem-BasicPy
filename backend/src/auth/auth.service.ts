// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { decryptPassword } from '../utils/crypto.util';
import { generateToken } from '../utils/jwt.util';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userRepo.findOne({ where: { username } });
    if (!user) {
      return { status: 'error', message: 'Invalid username' };
    }

    let decrypted = '';
    try {
      decrypted = decryptPassword(user.password);
    } catch (e) {
      return { status: 'error', message: 'Password decryption failed' };
    }

    if (decrypted.trim() !== password.trim()) {
      return { status: 'error', message: 'Incorrect password' };
    }

    const payload = {
      myname: user.myname,
      myposition: user.myposition,
      picture: user.picture,
    };

    const token = generateToken(payload);

    return {
      status: 'success',
      token,
      data: payload,
    };
  }
}
