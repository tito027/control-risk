import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  PaymentMethod,
  PaymentMethodDocument,
} from '../common/schemas/paymentMethod.schema';
import { Model } from 'mongoose';
@Injectable()
export class PaymentMethodService {
  constructor(
    @InjectModel(PaymentMethod.name)
    private readonly model: Model<PaymentMethodDocument>,
  ) {}

  async findAll(params, project): Promise<PaymentMethodDocument[]> {
    return this.model.find(params, project);
  }
}
