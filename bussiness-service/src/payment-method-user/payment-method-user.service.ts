import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model, Types } from 'mongoose';
import {
  PaymentMethodUser,
  PaymentMethodUserDocument,
} from 'src/common/schemas/paymentMethodUser.schema';
import { CreateAgentS2DTO } from 'src/common/dto/userInformation.dto';
@Injectable()
export class PaymentMethodUserService {
  constructor(
    @InjectModel(PaymentMethodUser.name)
    private readonly model: Model<PaymentMethodUserDocument>,
  ) {}

  async findAll(params, project): Promise<PaymentMethodUserDocument[]> {
    return this.model.find(params, project);
  }

  async create(payload: any) {
    return this.model.create({
      user: new Types.ObjectId(payload.userId),
      bank_account: payload.paymentAccount,
      bank_entity: payload.paymentEntity,
      payment_method: new Types.ObjectId(payload.paymentMethod),
      need_account: !!payload.paymentAccount && !!payload.paymentEntity,
    });
  }
}
