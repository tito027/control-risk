import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report, ReportDocument } from 'control-risk/schemas/report.schema';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name) private readonly model: Model<ReportDocument>,
  ) {}

  find(param: Partial<Report>) {
    return this.model.findOne(param);
  }
}
