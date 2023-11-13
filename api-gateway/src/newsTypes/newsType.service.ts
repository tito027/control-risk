import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  NewsType,
  NewsTypeDocument,
} from 'control-risk/schemas/newsType.schema';

@Injectable()
export class NewsTypeService {
  constructor(
    @InjectModel(NewsType.name)
    private readonly model: Model<NewsTypeDocument>,
  ) {}

  async findAll(
    params: Partial<NewsType>,
    project?: any,
  ): Promise<NewsTypeDocument[]> {
    return this.model.find({ ...params }, { ...project });
  }
}
