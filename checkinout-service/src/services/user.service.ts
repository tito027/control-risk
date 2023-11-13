import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'control-risk/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
  ) {}

  async findByCarnet(carnet: string): Promise<UserDocument> {
    return await this.model
      .findOne({ carnet, active: true })
      .populate('userInformation')
      .populate('assignment.agency')
      .populate('assignment.workday');
  }

  async findById(id: string): Promise<UserDocument> {
    return await this.model
      .findOne({ _id: id, active: true })
      .populate('userInformation')
      .populate('assignment.agency')
      .populate('assignment.workday')
      .populate('role');
  }

  async changeWorkinStatusByCarnet(
    carnet: string,
    working: boolean,
  ): Promise<UserDocument> {
    return await this.model.findOneAndUpdate(
      { carnet, active: true },
      { working },
    );
  }
}
