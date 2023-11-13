import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import {
  PhysicalPosition,
  PhysicalPositionDocument,
} from 'control-risk/schemas/physicalPosition.schema';
import {
  PhysicalPositionDTO,
  UpdateCoordinatesDTO,
  filterPhysicalPositionDTO,
} from '../common/dto/physicalPosition.dto';
import { getFilters, getStrictMatchs } from 'src/common/utils';
import { BasePayload } from 'src/common/dto/default.dto';

@Injectable()
export class PhysicalPositionsService {
  constructor(
    @InjectModel(PhysicalPosition.name)
    private readonly model: Model<PhysicalPositionDocument>,
  ) {}

  async create(
    physicalPosition: PhysicalPositionDTO,
  ): Promise<PhysicalPositionDocument> {
    return new this.model({ ...physicalPosition }).save();
  }
  async updateCoordinates(payload: UpdateCoordinatesDTO) {
    return this.model.findOneAndUpdate(
      { _id: payload.id },
      {
        latitude: payload.lat,
        longitude: payload.lng,
      },
    );
  }
  async findWithFilter(
    physicalPositionDTO: BasePayload<PhysicalPosition>,
  ): Promise<{ data: PhysicalPositionDocument[]; totalRegistros: number }> {
    const npagina =
      (physicalPositionDTO.pagination.currentPage - 1) *
      physicalPositionDTO.pagination.perPage;
    const queryFilters = getStrictMatchs(physicalPositionDTO.strict ?? {});
    const matchFilters = getFilters(physicalPositionDTO.params);
    if (!physicalPositionDTO.seeAll) {
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
          name: '$name',
          agency: '$agencyData.name',
          business: '$businessData.name',
          numSecurityAgent: '$numSecurityAgent',
          createdBy: {
            $concat: [
              { $arrayElemAt: ['$createdByData.name', 0] },
              ' ',
              { $arrayElemAt: ['$createdByData.lastname', 0] },
            ],
          },
          active: '$active',
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
            { $limit: physicalPositionDTO.pagination.perPage },
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

  async findAll(
    params?: Partial<PhysicalPosition>,
  ): Promise<PhysicalPositionDocument[]> {
    return this.model.find(params ?? {});
  }
  async findOne(id: string): Promise<PhysicalPositionDocument> {
    return this.model.findById({ _id: id, active: true }).populate('agency');
  }
  async update(
    id: string,
    physicalPosition: PhysicalPositionDTO,
  ): Promise<PhysicalPositionDocument> {
    return this.model.findByIdAndUpdate(id, { ...physicalPosition });
  }
  async inactivePhysicalPosition(
    id: string,
  ): Promise<PhysicalPositionDocument> {
    return this.model.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          active: false,
        },
      },
    );
  }
}
