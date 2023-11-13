import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from 'control-risk/schemas/rol.schema';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private readonly model: Model<RoleDocument>,
  ) {}

  async findRole(name: string): Promise<RoleDocument> {
    return this.model.findOne({ name: name});
  }

  async findAll(from = 8, to = 14) {
    return this.model.find({
      code: { $gte: from, $lte: to }
    });
  }

  async list(from = 8, to = 14) {
    return this.model.aggregate([
      {
        $match: {
          code: { $gte: from, $lte: to },
          active: true,
        },
      },
      {
        $project: {
          _id: 0,
          label: '$code',
          value: '$_id',
        },
      },
    ]);
  }
}
