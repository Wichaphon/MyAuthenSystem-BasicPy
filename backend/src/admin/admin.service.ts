import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Not } from 'typeorm';
import { User } from '../users/user.entity';
import { Role } from '../roles/role.entity';
import { deleteImageFromGCS, uploadImageToGCS } from '../utils/gcs.util';
import { encryptPassword } from '../utils/crypto.util';
import { convertImageUrlToBase64 } from '../utils/image.util'; 

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async getAllUsers() {
    const users = await this.userRepo.find({
      relations: ['role'],
      order: { id: 'ASC' },
    });

    const transformed = await Promise.all(
      users.map(async (user) => ({
        id: user.id,
        username: user.username,
        name: user.myname,
        role: user.role?.name,
        picture: await convertImageUrlToBase64(user.picture), 
        joined: new Date(user.create_datetime).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: '2-digit',
        }),
      })),
    );

    return transformed;
  }

  async deleteUser(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (user.picture?.includes('storage.googleapis.com')) {
      await deleteImageFromGCS(user.picture);
    }

    await this.userRepo.remove(user);

    return {
      status: 'success',
      message: 'User deleted successfully',
    };
  }

  async searchUsers(keyword: string) {
    const users = await this.userRepo.find({
      where: [
        { id: Number(keyword) || -1 },
        { username: ILike(`%${keyword}%`) },
        { myname: ILike(`%${keyword}%`) },
        { role: { name: ILike(`%${keyword}%`) } },
      ],
      relations: ['role'],
      order: { id: 'ASC' },
    });

    const transformed = await Promise.all(
      users.map(async (user) => ({
        id: user.id,
        username: user.username,
        name: user.myname,
        role: user.role?.name,
        picture: await convertImageUrlToBase64(user.picture), 
        joined: new Date(user.create_datetime).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: '2-digit',
        }),
      })),
    );

    return transformed;
  }

  async editUser(id: number, data: any, file?: Express.Multer.File) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['role'],
    });
    if (!user) throw new NotFoundException('User not found');

    const existing = await this.userRepo.findOne({
      where: {
        username: data.username,
        id: Not(id),
      },
    });
    if (existing) throw new ConflictException('Username already exists');

    if (file) {
      if (user.picture?.includes('storage.googleapis.com')) {
        await deleteImageFromGCS(user.picture);
      }
      const uploadedUrl = await uploadImageToGCS(file);
      user.picture = uploadedUrl;
    }

    user.username = data.username || user.username;
    user.myname = data.myname || user.myname;
    user.address = data.address || user.address;

    if (data.password) {
      user.password = encryptPassword(data.password);
    }

    if (data.roleId) {
      const foundRole = await this.roleRepo.findOne({ where: { id: Number(data.roleId) } });
      if (!foundRole) throw new NotFoundException('Role not found');
      user.role = foundRole;
    }

    if (data.myposition !== undefined) {
      user.myposition = data.myposition;
    }

    user.update_datetime = new Date();
    user.update_by = 'admin';

    await this.userRepo.save(user);

    return {
      status: 'success',
      message: 'User updated successfully',
    };
  }
}
