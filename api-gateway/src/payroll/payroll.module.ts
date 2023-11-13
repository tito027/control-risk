import { forwardRef, Module } from '@nestjs/common';
import { PayrollController } from './payroll.controller';
import { ProxyModule } from '../common/proxy/proxy.module';
import { RabbitModule } from 'src/rabbit/rabbit.module';
import { ConfigModule } from '@nestjs/config';
import { PayrollService } from './payroll.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Payroll, PayrollSchema } from 'control-risk/schemas/payroll.schema';

@Module({
  imports: [
    ProxyModule,
    forwardRef(() => RabbitModule),
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Payroll.name,
        schema: PayrollSchema,
      },
    ]),
  ],
  controllers: [PayrollController],
  providers: [PayrollService],
})
export class PayrollModule {}
