import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PaymentMethodDocument } from './paymentMethod.schema';
import { UserDocument } from 'control-risk/schemas/user.schema';

export type PaymentMethodUserDocument = PaymentMethodUser & Document;

@Schema({ timestamps: true })
export class PaymentMethodUser {
  @Prop({
    type: Types.ObjectId,
    ref: 'PaymentMethod',
    required: true,
  })
  payment_method: PaymentMethodDocument;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  user: UserDocument;

  @Prop({ required: true, default: false })
  need_account: boolean;

  @Prop({
    required: function () {
      return this.need_account;
    },
    validate: [validateBankAccount],
  })
  bank_account: string;

  @Prop({
    required: function () {
      return this.need_account;
    },
  })
  bank_entity: string;
}

function validateBankAccount(value: string): boolean {
  return (
    !this.need_account || (!!this.need_account && !!value && value.length >= 10)
  );
}

export const PaymentMethodUserSchema =
  SchemaFactory.createForClass(PaymentMethodUser);
