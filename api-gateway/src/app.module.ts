import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BusinessModule } from './business/business.module';
import { AgenciesModule } from './agencies/agencies.module';
import { PhysicalPositionModule } from './physical-position/physical-position.module';
import { ShedulesModule } from './shedules/shedules.module';
import { AuthModule } from './auth/auth.module';
import { CheckInOutModule } from './check-in-out/check-in-out.module';
import { RabbitModule } from './rabbit/rabbit.module';
import { ReasonsModule } from './reasons/reasons.module';
import { JwtModules } from './jwt/jwt.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { IConfig } from './common/interfaces/config.interface';
import { AgentsModule } from './agents/agents.module';
import { AssetsModule } from './assets/assets.module';
import { PayrollModule } from './payroll/payroll.module';
import { PsychicModule } from './psychic/psychic.module';
import { EntriesModule } from './entries/entries.module';
import { RequestUserModule } from './requestUser/requestUser.module';
import { ComplaintsModule } from './complaints/complaints.module';
import { NewsModule } from './news/news.module';
import { AgentModule } from './agent-agency/agent-agency.module';
import { PaymentMethodModule } from './payment-method/payment-method.module';
import { DiscountModule } from './discount/discount.module';
import { GratificationModule } from './gratification/gratification.module';
import { PayrollHistoryModule } from './payrollHistory/payrollHistory.module';
import { WorkShiftModule } from './workshift/workshift.module';
import { ReportsTypeModule } from './reportTypes/reportsType.module';
import { ReportsModule } from './reports/reports.module';
import { RolesModule } from './role/role.module';
import { SalariesModule } from './salaries/salaries.module';
import { NewsTypeModule } from './newsTypes/newsType.module';
import { InventoryModule } from './inventory/inventory.module';
import { ItemModule } from './items/item.module';
import { ItemTypeModule } from './itemType/itemType.module';
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
    BusinessModule,
    AgenciesModule,
    PhysicalPositionModule,
    ShedulesModule,
    UserModule,
    AuthModule,
    CheckInOutModule,
    RabbitModule,
    ReasonsModule,
    JwtModules,
    UserModule,
    AgentsModule,
    AssetsModule,
    PayrollModule,
    PsychicModule,
    AgentModule,
    PaymentMethodModule,
    DiscountModule,
    GratificationModule,
    PayrollHistoryModule,
    RequestUserModule,
    ComplaintsModule,
    NewsModule,
    NewsTypeModule,
    ReportsModule,
    ReportsTypeModule,
    EntriesModule,
    WorkShiftModule,
    RolesModule,
    SalariesModule,
    InventoryModule,
    ItemModule,
    ItemTypeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
