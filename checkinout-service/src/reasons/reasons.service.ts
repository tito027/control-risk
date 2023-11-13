import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reason, ReasonDocument } from 'src/reasons/reason.schema';

@Injectable()
export class ReasonsService {
  constructor(
    @InjectModel(Reason.name) private readonly model: Model<ReasonDocument>,
  ) {}

  async findByType(type: 'position' | 'time'): Promise<ReasonDocument[]> {
    return await this.model.find({ [type]: true, active: true });
  }

  async findByIdAndPosition(id: string): Promise<ReasonDocument> {
    return await this.model.findOne({ _id: id, position: true, active: true });
  }

  async findByIdAndTime(id: string): Promise<ReasonDocument> {
    return await this.model.findOne({ _id: id, time: true, active: true });
  }
}
