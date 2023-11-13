import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Agency, AgencyDocument } from 'control-risk/schemas/agency.schema';

@Injectable()
export class AgencyService {
  constructor(
    @InjectModel(Agency.name) private readonly model: Model<AgencyDocument>,
  ) {}

  async findIdsBySupervisor(supervisor: string): Promise<any[]> {
    const agencies = await this.model.find(
      { supervisor, active: true },
      { _id: 1 },
    );

    return agencies.map((agency) => {
      return agency._id;
    });
  }
}
