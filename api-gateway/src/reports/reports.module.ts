import { forwardRef, Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ProxyModule } from '../common/proxy/proxy.module';
import { RabbitModule } from 'src/rabbit/rabbit.module';
import { ConfigModule } from '@nestjs/config';
import { ReportsService } from './reports.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Report, ReportSchema } from 'control-risk/schemas/report.schema';

@Module({
  imports: [
    ProxyModule,
    forwardRef(() => RabbitModule),
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Report.name,
        schema: ReportSchema,
      },
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
