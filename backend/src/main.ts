// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Enable CORS ให้frontดึงข้อมูลข้ามportได้
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:30001'],
    credentials: true,
  });

  await app.listen(5000); //ตรงกับ docker-compose: ports 30002:5000
}
bootstrap();
