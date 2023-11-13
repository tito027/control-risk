import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument } from 'control-risk/schemas/user.schema';
// TODO modificar
@Injectable()
export class AgentService {
  constructor(
    @InjectModel(User.name)
    private readonly model: Model<UserDocument>,
  ) {}

  async findById(agentId: string): Promise<UserDocument> {
    return this.model.findOne({ _id: agentId });
  }

  async findActiveAgent(): Promise<UserDocument | any> {
    return this.model.findOne({ status: true });
  }

  async agencyById(agentId: string): Promise<any> {
    const queryagg = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(agentId),
        },
      },
      {
        $lookup: {
          from: 'agencies',
          localField: 'assignment.agency',
          foreignField: '_id',
          as: 'agencyData',
        },
      },
      { $unwind: { path: '$agencyData', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          name: '$agencyData.name',
          _id: '$agencyData._id',
        },
      },
    ];
    const dato = await this.model.aggregate(queryagg);
    return dato;
  }

  async findByFilter(dto: any): Promise<any> {
    const npagina = dto
      ? (dto.pagination.currentPage - 1) * dto.pagination.perPage
      : 0;
    const limit = dto ? dto.pagination.perPage : 5;
    const queryAggregate = [
      {
        $lookup: {
          from: 'users',
          localField: 'change_by',
          foreignField: '_id',
          as: 'fromUserData',
        },
      },
      { $unwind: { path: '$fromUserData', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'userinformations',
          localField: 'fromUserData.userInformation',
          foreignField: '_id',
          as: 'fromUserInformationData',
        },
      },
      {
        $unwind: {
          path: '$fromUserInformationData',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userPersonalData',
        },
      },
      {
        $unwind: {
          path: '$userPersonalData',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'userinformations',
          localField: 'userPersonalData.userInformation',
          foreignField: '_id',
          as: 'userInformationPersonalData',
        },
      },
      {
        $unwind: {
          path: '$userInformationPersonalData',
          preserveNullAndEmptyArrays: true,
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
      { $unwind: { path: '$agencyData', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          is_pending: 1,
          is_rejected: 1,
          observations: 1,
          init_date: 1,
          end_date: 1,
          agency_name: '$agencyData.name',
          agency: 1,
          change_by: 1,
          change_by_detail: {
            $concat: [
              '$fromUserInformationData.lastname',
              ' ',
              '$fromUserInformationData.name',
            ],
          },
          user: 1,
          user_detail: {
            $concat: [
              '$userPersonalData.carnet',
              ' ',
              '$userInformationPersonalData.lastname',
              ' ',
              '$userInformationPersonalData.name',
            ],
          },
        },
      },
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [{ $skip: npagina }, { $limit: limit }],
        },
      },
    ];

    const modelos = await this.model.aggregate(queryAggregate);

    const datafinal = {
      data: modelos[0].data,
      totalRegistros: modelos[0].metadata[0]?.total
        ? modelos[0].metadata[0].total
        : 0,
    };
    return datafinal;
  }
  
}
