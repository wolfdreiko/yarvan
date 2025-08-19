import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  
  const port = process.env.PORT || 3006;
  await app.listen(port);
  
  console.log(`💰 Pricing service running on port ${port}`);
}
bootstrap();