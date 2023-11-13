import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import {
  AssignmentHistory,
  AssignmentHistoryDocument,
} from 'control-risk/schemas/assignmentHistory.schema';
import { getFilters } from 'src/common/utils';

@Injectable()
export class AssignmentHistoryService {
  constructor(
    @InjectModel(AssignmentHistory.name)
    private readonly model: Model<AssignmentHistoryDocument>,
  ) {}

  async create(assignment: any ): Promise<AssignmentHistoryDocument> {
    const newAssignment = new this.model({ ...assignment });
    return newAssignment.save();
  }

  async listByUser(userId: string, data: any) {
    const totalSkip =
      (data.pagination.currentPage - 1) * data.pagination.perPage;
    const filters = getFilters(data.params);
    if (!data.seeAll) {
      filters.push({ active: true });
    }
    const query: PipelineStage[] = [
      {
        $match: {
          user: userId,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $lookup: {
          from: 'agencies',
          localField: 'agency',
          foreignField: '_id',
          as: 'agencyData',
        },
      },
      {
        $lookup: {
          from: 'businesses',
          localField: 'agencyData.business',
          foreignField: '_id',
          as: 'businessData',
        },
      },
      {
        $lookup: {
          from: 'roles',
          localField: 'role',
          foreignField: '_id',
          as: 'roleData',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdByData',
        },
      },
      {
        $lookup: {
          from: 'userinformations',
          localField: 'createdByData.userInformation',
          foreignField: '_id',
          as: 'createdByInfoData',
        },
      },
      {
        $project: {
          business: { $arrayElemAt: ['$businessData.name', 0] },
          agency: { $arrayElemAt: ['$agencyData.name', 0] },
          role: { $arrayElemAt: ['$roleData.code', 0] },
          salary: '$salary',
          createdBy: {
            $concat: [
              { $arrayElemAt: ['$createdByInfoData.name', 0] },
              ' ',
              { $arrayElemAt: ['$createdByInfoData.lastname', 0] },
            ],
          },
          date: '$createdAt',
          active: '$active',
        },
      },
      {
        $match: {
          $and: filters,
        },
      },
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [{ $skip: totalSkip }, { $limit: data.pagination.perPage }],
        },
      },
    ];
    const list = await this.model.aggregate(query);
    return {
      data: list[0].data,
      totalRegistros:
        list[0].metadata.length > 0 ? list[0].metadata[0].total : 0,
    };
  }
}
