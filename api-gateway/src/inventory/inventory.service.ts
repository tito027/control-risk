import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Inventory,
  InventoryDocument,
} from 'control-risk/schemas/inventory.schema';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name)
    private readonly model: Model<InventoryDocument>,
  ) {}

  async findAll(
    params: Partial<Inventory>,
    project?: any,
  ): Promise<InventoryDocument[]> {
    return this.model.find({ ...params }, { ...project });
  }
}
