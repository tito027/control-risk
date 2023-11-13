import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ItemType,
  ItemTypeDocument,
} from 'control-risk/schemas/itemType.schema';

@Injectable()
export class ItemTypeService {
  constructor(
    @InjectModel(ItemType.name)
    private readonly model: Model<ItemTypeDocument>,
  ) {}

  async findAll(
    params: Partial<ItemType>,
    project?: any,
  ): Promise<ItemTypeDocument[]> {
    return this.model.find({ ...params }, { ...project });
  }
}
