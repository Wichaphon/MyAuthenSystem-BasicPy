// import './types/express'; // 👈 ต้องใส่บนสุดเพื่อขยาย Request.user
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(5000); // ตรงกับ docker-compose ที่ expose 5000
}
bootstrap();
