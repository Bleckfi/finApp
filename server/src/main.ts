import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173', // твой фронтенд
    credentials: true, // важно для cookie/session
  });

  await app.listen(3000, '0.0.0.0', () => {
    console.log('Server is running on port 3000');
  });
}
bootstrap();
