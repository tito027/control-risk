import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'control-risk/schemas/user.schema';

@Injectable()
export class AgentsService {
  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
  ) {}

  find(param: Partial<User>) {
    return this.model.findOne(param);
  }
}
