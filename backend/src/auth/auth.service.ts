import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Role } from '../roles/role.entity';
import { decryptPassword, encryptPassword } from '../utils/crypto.util';
import { generateToken } from '../utils/jwt.util';
import { RegisterDto } from './dto/register.dto';
import { Express } from 'express';
import { validateImageFile } from '../utils/file-validator.util';
import { uploadImageToGCS } from '../utils/gcs.util';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userRepo.findOne({
      where: { username },
      relations: ['role'],
    });

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
      role: user.role?.name,
      address: user.address,
    };

    const token = generateToken(payload);

    return {
      status: 'success',
      token,
      role: user.role?.name, 
    };
  }

  async register(dto: RegisterDto, file: Express.Multer.File) {
    const existUser = await this.userRepo.findOne({
      where: { username: dto.username },
    });

    if (existUser) {
      throw new BadRequestException('Username already exists');
    }

    const userRole = await this.roleRepo.findOne({
      where: { name: 'user' },
    });

    if (!userRole) {
      throw new BadRequestException('Default role not found');
    }

    validateImageFile(file);
    const imageUrl = await uploadImageToGCS(file);
    const encryptedPassword = encryptPassword(dto.password);

    const newUser = this.userRepo.create({
      username: dto.username,
      password: encryptedPassword,
      myname: dto.myname,
      picture: imageUrl,
      address: dto.address,
      role: userRole,
      myposition: 'pending',
      create_datetime: new Date(),
      update_datetime: new Date(),
      create_by: 'system',
      update_by: 'system',
    });

    await this.userRepo.save(newUser);

    return { status: 'success', message: 'User registered successfully' };
  }
}
