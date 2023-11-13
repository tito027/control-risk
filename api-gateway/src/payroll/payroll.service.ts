import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { User, UserDocument } from 'control-risk/user.schema.d';
import { Payroll, PayrollDocument } from 'control-risk/schemas/payroll.schema';

@Injectable()
export class PayrollService {
  constructor(
    @InjectModel(Payroll.name) private readonly model: Model<PayrollDocument>,
  ) {}

  find(param: Partial<Payroll>) {
    return this.model.findOne(param);
  }
}
