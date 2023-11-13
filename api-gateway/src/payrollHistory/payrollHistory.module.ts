import { forwardRef, Module } from '@nestjs/common';
import { PayrollHistoryController } from './payrollHistory.controller';
import { ProxyModule } from '../common/proxy/proxy.module';
import { RabbitModule } from 'src/rabbit/rabbit.module';
import { ConfigModule } from '@nestjs/config';
import { PayrollHistoryService } from './payrollHistory.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PayrollHistory,
  PayrollHistorySchema,
} from 'control-risk/schemas/payrollHistory.schema';

@Module({
  imports: [
    ProxyModule,
    forwardRef(() => RabbitModule),
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: PayrollHistory.name,
        schema: PayrollHistorySchema,
      },
    ]),
  ],
  controllers: [PayrollHistoryController],
  providers: [PayrollHistoryService],
})
export class PayrollHistoryModule {}
