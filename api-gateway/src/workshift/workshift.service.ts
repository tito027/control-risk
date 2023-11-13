import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'control-risk/schemas/user.schema';
// TODO modificar
@Injectable()
export class WorkShiftService {
  constructor(
    @InjectModel(User.name)
    private readonly model: Model<UserDocument>,
  ) {}

  async findById(agentId: string): Promise<UserDocument> {
    return this.model.findOne({ _id: agentId });
  }
}
