// Setup env variables before import other modules
import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { getEnv } from 'src/utils/env-variable.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = getEnv.number('PORT');

  // Setup middleware
  app.enableCors();
  app.use(cookieParser());

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('Expense')
    .setDescription('Expense API documentation')
    .setVersion('0.0.1')
    .addSecurity('Bearer', {
      type: 'http',
      scheme: 'Bearer',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Run server
  await app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
  });
}

bootstrap();
