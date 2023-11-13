import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery, Model, PipelineStage, Types } from 'mongoose';
import { Agency, AgencyDocument } from 'control-risk/schemas/agency.schema';
import { AgenciesDTO, filterAgenciesDTO } from '../common/dto/agencies.dto';
import { PhysicalPositionDocument } from 'control-risk/schemas/physicalPosition.schema';
import { getFilters, getStrictMatchs } from 'src/common/utils';
import { inspect } from 'util';
import { BasePayload } from 'src/common/dto/default.dto';
@Injectable()
export class AgenciesService {
  constructor(
    @InjectModel(Agency.name)
    private readonly model: Model<AgencyDocument>,
  ) {}

  async create(agency: AgenciesDTO): Promise<AgencyDocument> {
    const str = `${agency.name} ${agency.zone}`;
    let slug = str.replace(/^\s+|\s+$/g, '');
    slug = slug.toLowerCase();
    slug = slug
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    return new this.model({ ...agency, slug }).save();
  }

  async findOneByParams(payload: Partial<Agency>) {
    return this.model.findOne(payload).populate([
      {
        path: 'supervisor',
        populate: 'userInformation',
      },
      {
        path: 'business',
      },
    ]);
  }

  async getIndicators(agencyId: string) {
    const queryagg: PipelineStage[] = [
      {
        $match: {
          _id: new Types.ObjectId(agencyId),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'assignment.agency',
          pipeline: [
            {
              $lookup: {
                from: 'roles',
                localField: 'role',
                foreignField: '_id',
                as: 'role',
              },
            },
            { $unwind: '$role' },
            {
              $group: {
                _id: '$role.code',
                count: { $count: {} },
              },
            },
            {
              $project: {
                _id: 0,
                code: '$_id',
                count: '$count',
              },
            },
          ],
          as: 'assignedAgents',
        },
      },
      {
        $project: {
          assignedAgents: '$assignedAgents',
          totalAgents: [
            {
              code: 8,
              total: '$numGroupLeader',
            },
            { code: 9, total: '$numSecurityAgent' },
            { code: 10, total: '$numPpi' },
            { code: 11, total: '$numMotorAgent' },
            { code: 12, total: '$numDriver' },
            { code: 13, total: '$numPreventionAgent' },
          ],
        },
      },
    ];
    const data = await this.model.aggregate(queryagg);
    return data[0];
  }
  async findAll(
    query?: FilterQuery<AgencyDocument>,
  ): Promise<AgencyDocument[]> {
    return this.model.find({ active: true, ...query });
  }
  async findOne(id: string): Promise<AgencyDocument> {
    return this.model.findOne({ _id: id, active: true });
  }

  async findWithFilter(
    agenciesDto: BasePayload<Agency>,
  ): Promise<{ data: AgencyDocument[]; totalRegistros: number }> {
    const npagina =
      (agenciesDto.pagination.currentPage - 1) * agenciesDto.pagination.perPage;
    const queryFilters = getStrictMatchs<Agency>(agenciesDto.strict ?? {});
    const matchFilters = getFilters(agenciesDto.params);
    if (!agenciesDto.seeAll) {
      matchFilters.push({ active: true });
    }
    const query: PipelineStage[] = [
      {
        $match: {
          $and: queryFilters,
        },
      },
      {
        $sort: {
          createdAt: 1,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'assignment.agency',
          pipeline: [
            {
              $group: {
                _id: null,
                count: { $count: {} },
              },
            },
          ],
          as: 'assignedAgents',
        },
      },
      {
        $lookup: {
          from: 'businesses',
          localField: 'business',
          foreignField: '_id',
          as: 'businessdata',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'supervisor',
          foreignField: '_id',
          as: 'supervisorUser',
        },
      },
      {
        $lookup: {
          from: 'userinformations',
          localField: 'supervisorUser.userInformation',
          foreignField: '_id',
          as: 'supervisorData',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdByUser',
        },
      },
      {
        $lookup: {
          from: 'userinformations',
          localField: 'createdByUser.userInformation',
          foreignField: '_id',
          as: 'createdByData',
        },
      },
      {
        $project: {
          _id: '$_id',
          assignedAgents: { $arrayElemAt: ['$assignedAgents.count', 0] },
          totalAgents: {
            $sum: [
              '$numSecurityAgent',
              '$numGroupLeader',
              '$numPpi',
              '$numMotorAgent',
              '$numDriver',
              '$numPreventionAgent',
            ],
          },
          name: '$name',
          zone: '$zone',
          slug: '$slug',
          businessId: { $arrayElemAt: ['$businessdata._id', 0] },
          business: { $arrayElemAt: ['$businessdata.name', 0] },
          businessSlug: { $arrayElemAt: ['$businessdata.slug', 0] },
          active: '$active',
          supervisor: {
            $concat: [
              { $arrayElemAt: ['$supervisorData.name', 0] },
              ' ',
              { $arrayElemAt: ['$supervisorData.lastname', 0] },
            ],
          },
          createdBy: {
            $concat: [
              { $arrayElemAt: ['$createdByData.name', 0] },
              ' ',
              { $arrayElemAt: ['$createdByData.lastname', 0] },
            ],
          },
        },
      },
      {
        $match: {
          $and: matchFilters,
        },
      },
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [
            { $skip: npagina },
            { $limit: agenciesDto.pagination.perPage },
          ],
        },
      },
    ];
    const modelos = await this.model.aggregate(query);
    const datafinal = {
      data: modelos[0].data,
      totalRegistros: modelos[0].metadata[0]?.total
        ? modelos[0].metadata[0].total
        : 0,
    };
    return datafinal;
  }

  async find(params: Partial<Agency>): Promise<AgencyDocument[]> {
    return this.model.find({ ...params, active: true });
  }
  async update(
    id: string,
    agency: Partial<AgencyDocument>,
  ): Promise<AgencyDocument> {
    return this.model.findByIdAndUpdate(id, { ...agency });
  }

  async inactiveAgency(id: string): Promise<AgencyDocument> {
    return this.model.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          active: false,
        },
      },
    );
  }

  async findPhysicalPosition(id: string): Promise<PhysicalPositionDocument[]> {
    const Agency = await this.model
      .findOne({ _id: id, active: true })
      .populate<{ physicalpositions: PhysicalPositionDocument[] | undefined }>(
        'physicalpositions',
      )
      .exec();
    return !!Agency ? Agency.physicalpositions : [];
  }
  async listByBusiness(business: string) {
    return this.model.aggregate([
      {
        $match: {
          business: new mongoose.Types.ObjectId(business),
          active: true,
        },
      },
      {
        $project: {
          _id: 0,
          label: '$name',
          value: '$_id',
        },
      },
    ]);
  }

  async findConfig(id: string) {
    return this.model.findById(id, {
      supervisor: '$supervisor',
      numSecurityAgent: '$numSecurityAgent',
      numGroupLeader: '$numGroupLeader',
      numPpi: '$numPpi',
      numMotorAgent: '$numMotorAgent',
      numDriver: '$numDriver',
      numPreventionAgent: '$numPreventionAgent',
    });
  }
}
