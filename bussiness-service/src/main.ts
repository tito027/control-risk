import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { RabbitMQ } from './common/Constants';
import { ExceptionFilter } from './common/filters/ExceptionHandlers';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.AMQP_URL],
      queue: RabbitMQ.BusinessQueue,
    },
    queueOptions: {},
  });
  app.useGlobalFilters(new ExceptionFilter());
  await app.listen();
}
bootstrap();
