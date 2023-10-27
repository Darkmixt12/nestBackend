import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
  // esto hace un mega bloqueo para hacer unas mega validaciones instalar npm i class-validator class-transformer
  app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  })
  )

  await app.listen(3000);
}
bootstrap();
