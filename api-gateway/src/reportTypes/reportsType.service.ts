import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ReportType,
  ReportTypeDocument,
} from 'control-risk/schemas/reportType.schema';

@Injectable()
export class ReportsTypeService {
  constructor(
    @InjectModel(ReportType.name)
    private readonly model: Model<ReportTypeDocument>,
  ) {}

  async findAll(
    params: Partial<ReportType>,
    project?: any,
  ): Promise<ReportTypeDocument[]> {
    return this.model.find({ ...params }, { ...project });
  }
}
