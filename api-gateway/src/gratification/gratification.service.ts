import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { User, UserDocument } from 'control-risk/user.schema.d';
import {
  Gratification,
  GratificationDocument,
} from 'control-risk/schemas/gratification.schema';

@Injectable()
export class GratificationService {
  constructor(
    @InjectModel(Gratification.name)
    private readonly model: Model<GratificationDocument>,
  ) {}

  find(param: Partial<Gratification>) {
    return this.model.findOne(param);
  }
}
