import { forwardRef, Module } from '@nestjs/common';
import { RabbitModule } from 'src/rabbit/rabbit.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportsTypeController } from './reportsType.controller';
import { ReportsTypeService } from './reportsType.service';
import { ReportType, ReportTypeSchema } from 'control-risk/schemas/reportType.schema';
import { ProxyModule } from 'src/common/proxy/proxy.module';
import { ConfigModule } from '@nestjs/config';

// TODO para poder requerir otros servicios de otra carpeta debo importarlo aca
@Module({
  imports: [
    ProxyModule,
    forwardRef(() => RabbitModule),
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: ReportType.name,
        schema: ReportTypeSchema,
      },
    ]),
  ],
  controllers: [ReportsTypeController],
  providers: [ReportsTypeService],
})
export class ReportsTypeModule {}
