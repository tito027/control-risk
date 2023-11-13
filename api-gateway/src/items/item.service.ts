import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Item, ItemDocument } from 'control-risk/schemas/item.schema';

@Injectable()
export class ItemService {
  constructor(
    @InjectModel(Item.name)
    private readonly model: Model<ItemDocument>,
  ) {}

  async findAll(params: Partial<Item>, project?: any): Promise<ItemDocument[]> {
    return this.model.find({ ...params }, { ...project });
  }
}
