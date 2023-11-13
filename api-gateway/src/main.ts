import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { IConfig } from './common/interfaces/config.interface';
import { ExceptionHandlers } from './common/filters/ExceptionHandlers';
import { TimeOutInterceptor } from './common/interceptors/timeout.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: { origin: '*' },
  });
  const configService = app.get<ConfigService<IConfig>>(ConfigService);
  app.useGlobalFilters(new ExceptionHandlers());
  app.useGlobalInterceptors(new TimeOutInterceptor());
  app.useStaticAssets(configService.get('FILE_PATH'), {
    prefix: '/public/',
    setHeaders: (res, path, stat) => {
      res.set('Access-Control-Allow-Origin', '*');
    },
  });
  const options = new DocumentBuilder()
    .setTitle('Control Risk - API GATEWAY')
    .setDescription(
      'API designada para el control de operacion de comunicacion a nivel de microservicios ',
    )
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/swagger/docs', app, document, {
    swaggerOptions: { filter: true },
  });
  await app.listen(configService.get('PORT'));
  console.log('🚀 Api Start port: ' + configService.get('PORT'));
}
bootstrap();
