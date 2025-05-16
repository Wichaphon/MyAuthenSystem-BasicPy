import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db', // จาก docker-compose
      port: 5432,
      username: 'admin_user',
      password: 'lborjgldo_9384kkfgp',
      database: 'auth_db',
      entities: [User],
      synchronize: true, // dev only (ห้ามใช้ production)
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
