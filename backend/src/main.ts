// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Enable CORS ให้frontดึงข้อมูลข้ามportได้
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:30001', 'https://testing001.riverpark.app'],
    credentials: true,
  });

  await app.listen(8000, '0.0.0.0'); //ตรงกับ docker-compose: ports 30002:5000
}
bootstrap();