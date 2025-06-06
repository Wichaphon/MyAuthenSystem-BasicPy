import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Role } from '../roles/role.entity'; 

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])], 
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
