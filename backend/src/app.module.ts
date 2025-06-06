import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Role } from './roles/role.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module'; 

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'admin_user',
      password: 'lborjgldo_9384kkfgp',
      database: 'auth_db',
      entities: [User, Role],
      synchronize: true, // dev only
    }),
    AuthModule,
    AdminModule, // ✅ เพิ่มตรงนี้
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
