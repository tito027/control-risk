import { ConfigModule, ConfigService } from '@nestjs/config';
import MongooseDelete = require('mongoose-delete');
import MongoosePaginate = require('mongoose-paginate');
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BusinessModule } from './business/business.module';
import { AgenciesModule } from './agencies/agencies.module';
import { PhysicalPositionsModule } from './physical-positions/physical-positions.module';
import { SchedulesModule } from './schedules/schedules.module';
import { RabbitModule } from './rabbit/rabbit.module';
import { CarnetModule } from './carnet/carnet.module';
import { UsersModule } from './users/users.module';
import { UsersInformationsModule } from './users-informations/users-informations.module';
import { PaymentMethodModule } from './payment-method/payment-method.module';
import { PsychicModule } from './psychic/psychic.module';
import { RolesModule } from './roles/roles.module';
import { SalariesModule } from './salaries/salaries.module';
import { AssignmentHistoryModule } from './assignment-history/assignmentHistory.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.development.env'],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        console.log(process.env.MONGO_URL);
        return {
          uri: configService.get('MONGO_URL')
            ? configService.get('MONGO_URL')
            : `mongodb://${configService.get('MONGO_HOST')}:${configService.get(
                'MONGO_PORT',
              )}/${configService.get('MONGO_DB')}`,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          connectionFactory: (connection) => {
            connection.plugin(MongooseDelete);
            connection.plugin(MongoosePaginate);
            return connection;
          },
        };
      },
      inject: [ConfigService],
    }),
    BusinessModule,
    AgenciesModule,
    PhysicalPositionsModule,
    SchedulesModule,
    RabbitModule,
    CarnetModule,
    UsersModule,
    UsersInformationsModule,
    PaymentMethodModule,
    PsychicModule,
    RolesModule,
    SalariesModule,
    AssignmentHistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
