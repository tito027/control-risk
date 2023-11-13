import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { User, UserDocument } from 'control-risk/user.schema.d';
import {
  PayrollHistory,
  PayrollHistoryDocument,
} from 'control-risk/schemas/payrollHistory.schema';

@Injectable()
export class PayrollHistoryService {
  constructor(
    @InjectModel(PayrollHistory.name)
    private readonly model: Model<PayrollHistoryDocument>,
  ) {}

  find(param: Partial<PayrollHistory>) {
    return this.model.findOne(param);
  }
}
