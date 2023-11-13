import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  RequestUser,
  RequestUserDocument,
} from 'control-risk/schemas/requestUser.schema';

@Injectable()
export class RequestUserService {
  constructor(
    @InjectModel(RequestUser.name)
    private readonly model: Model<RequestUserDocument>,
  ) {}

  find(param: Partial<RequestUser>) {
    return this.model.findOne(param);
  }
}
