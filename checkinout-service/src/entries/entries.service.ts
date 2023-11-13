import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Entries, EntriesDocument } from 'control-risk/schemas/entries.schema';

@Injectable()
export class EntriesService {
  constructor(
    @InjectModel(Entries.name) private readonly model: Model<EntriesDocument>,
  ) {}
  create(createEntryDto: Partial<EntriesDocument>) {
    return this.model.create(createEntryDto);
  }

  findAll() {
    return `This action returns all entries`;
  }

  findOne(query: FilterQuery<EntriesDocument>) {
    return this.model.findOne(query);
  }

  update(id: string, payload: Partial<EntriesDocument>) {
    return this.model.findByIdAndUpdate(id, {
      $set: payload,
    });
  }
  remove(id: number) {
    return `This action removes a #${id} entry`;
  }
  aggregate(query: any) {
    return this.model.aggregate(query);
  }
}
