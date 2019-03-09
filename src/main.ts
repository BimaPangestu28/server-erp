import 'dotenv/config';

import { NestFactory, FastifyAdapter } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

const PORT = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter());
  await app.listen(PORT);

  Logger.log(`Server running on port ${PORT}`);
}
bootstrap();
