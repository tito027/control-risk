import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Complaint, ComplaintDocument } from 'control-risk/schemas/complaint.schema';

@Injectable()
export class ComplaintsService {
  constructor(
    @InjectModel(Complaint.name) private readonly model: Model<ComplaintDocument>,
  ) {}

  find(param: Partial<Complaint>) {
    return this.model.findOne(param);
  }
}
