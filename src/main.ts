import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { MulterExceptionFilter } from './multer.exception';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new MulterExceptionFilter());
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
