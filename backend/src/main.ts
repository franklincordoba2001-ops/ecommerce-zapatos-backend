import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map((o) => o.trim())
    : true;

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });
  
  // Habilitar validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Filtra propiedades que no estén en el DTO
      transform: true, // Transforma los tipos automáticamente (ej: string a number en query params)
    }),
  );

  // Aumentar límites de tamaño para admitir imágenes locales convertidas a Base64 en el frontend
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ limit: '15mb', extended: true }));

  // Asegurar que la carpeta de subidas de imágenes existe y servirla de forma estática
  const uploadsDir = join(__dirname, '..', 'uploads');
  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir);
  }
  app.use('/uploads', express.static(uploadsDir));
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
