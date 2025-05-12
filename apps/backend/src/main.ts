import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure CORS with explicit origins
  app.enableCors({
    origin: [
      'https://titro.app',
      'https://www.titro.app',
      'http://localhost:5173', // Vite's default dev server port
      'http://127.0.0.1:5173', // Alternative localhost
      'http://localhost:3001', // Development server port
      'http://127.0.0.1:3001', // Alternative localhost for dev
    ],
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
