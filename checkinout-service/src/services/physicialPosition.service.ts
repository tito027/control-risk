import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PhysicalPosition,
  PhysicalPositionDocument,
} from 'control-risk/schemas/physicalPosition.schema';

@Injectable()
export class PhysicalPositionService {
  constructor(
    @InjectModel(PhysicalPosition.name)
    private readonly model: Model<PhysicalPositionDocument>,
  ) {}

  async findById(id: string): Promise<PhysicalPositionDocument> {
    return await this.model.findById(id);
  }
}
