import { forwardRef, Module } from '@nestjs/common';
import { PaymentMethodController } from './payment-method.controller';
import { ProxyModule } from '../common/proxy/proxy.module';
import { RabbitModule } from 'src/rabbit/rabbit.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PaymentMethod,
  PaymentMethodSchema,
} from 'control-risk/schemas/paymentMethod.schema';

@Module({
  imports: [
    ProxyModule,
    forwardRef(() => RabbitModule),
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: PaymentMethod.name,
        schema: PaymentMethodSchema,
      },
    ]),
  ],
  controllers: [PaymentMethodController],
  providers: [],
})
export class PaymentMethodModule {}
