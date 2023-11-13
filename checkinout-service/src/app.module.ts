import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CheckInOutModule } from './check-in-out/check-in-out.module';
import { RabbitModule } from './rabbit/rabbit.module';
import { IConfig } from './common/interfaces/config.interface';
import { EntriesModule } from './entries/entries.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: path.join(__dirname, `../config/env/.development.env`),
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<IConfig>) => ({
        uri: configService.get('MONGO_URL')
          ? configService.get('MONGO_URL')
          : `mongodb://${configService.get('MONGO_HOST')}:${configService.get(
              'MONGO_PORT',
            )}/${configService.get('MONGO_DB')}`,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    EntriesModule,
    CheckInOutModule,
    RabbitModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
