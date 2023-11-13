import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsEnum } from 'class-validator';

export enum PaymentMethods {
  EFECTIVO = 'Efectivo',
  CHEQUE = 'Cheque',
  BANCO = 'Banco',
}
export type PaymentMethodDocument = PaymentMethod & Document;

@Schema({ timestamps: true })
export class PaymentMethod {
  @Prop({ required: true })
  @IsEnum(PaymentMethods)
  name: string;

  @Prop({ required: true, default: true })
  active: Boolean;

  @Prop({ required: true, default: false })
  need_account: boolean;

  @Prop({
    required: function () {
      return this.need_account;
    },
  })
  bank_entities: string[];

  @Prop({ validate: validateOriginAccounts })
  origin_accounts: [
    {
      active: boolean;
      bank_entity: string;
      bank_account: string;
    },
  ];
}

function validateOriginAccounts(value: any[]): boolean {
  const { need_account, bank_entities } = this;
  /** si necesita cuenta de banco y no vienen configuraciones de cuentas de entidades bancarias
   * o la cantidad de configuraciones de entidades bancarias no es igual ala cantidad de entidades
   * retorna false o sino true
   */
  return !(need_account && (!value || value.length !== bank_entities.length));
}

export const PaymentMethodSchema = SchemaFactory.createForClass(PaymentMethod);
