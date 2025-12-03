import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import * as express from 'express';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';


const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  app.use(express.static(join(__dirname, '..', 'public')));
  app.enableCors({
    allowedHeaders: ['Content-Type', 'Access-Control-Allow-Origin','x-csrf-token'],
    origin: [`http://${process.env.CLIENT_DOMAIN}`, `https://${process.env.CLIENT_DOMAIN}`],
    credentials: true,
  });
//   app.useGlobalPipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: false }));
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use(cookieParser());
  await app.listen(process.env.PORT || 4000);
}

config();
bootstrap();