import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PaymentMethodUser,
  PaymentMethodUserSchema,
} from 'src/common/schemas/paymentMethodUser.schema';
import { PaymentMethodUserService } from './payment-method-user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PaymentMethodUser.name,
        schema: PaymentMethodUserSchema,
      },
    ]),
  ],
  providers: [PaymentMethodUserService],
  exports: [PaymentMethodUserService],
})
export class PaymentMethodUserModule {}
