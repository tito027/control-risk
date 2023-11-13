import { Module } from '@nestjs/common';
import { PaymentMethodController } from './payment-method.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PaymentMethod,
  PaymentMethodSchema,
} from 'src/common/schemas/paymentMethod.schema';
import { PaymentMethodService } from './payment-method.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PaymentMethod.name,
        schema: PaymentMethodSchema,
      },
    ]),
  ],
  controllers: [PaymentMethodController],
  providers: [PaymentMethodService],
})
export class PaymentMethodModule {}
