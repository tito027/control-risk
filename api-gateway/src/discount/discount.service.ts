import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { User, UserDocument } from 'control-risk/user.schema.d';
import {
  Discount,
  DiscountDocument,
} from 'control-risk/schemas/discount.schema';

@Injectable()
export class DiscountService {
  constructor(
    @InjectModel(Discount.name) private readonly model: Model<DiscountDocument>,
  ) {}

  find(param: Partial<Discount>) {
    return this.model.findOne(param);
  }
}
