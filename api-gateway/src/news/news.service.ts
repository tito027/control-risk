import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { New, NewDocument } from 'control-risk/schemas/new.schema';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(New.name) private readonly model: Model<NewDocument>,
  ) {}

  find(param: Partial<New>) {
    return this.model.findOne(param);
  }
}
