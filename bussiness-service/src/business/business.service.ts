import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { BusinessDTO, filterBusinessDTO } from 'src/common/dto/business.dto';
import { getFilters } from 'src/common/utils';
import {
  Business,
  BusinessDocument,
} from 'control-risk/schemas/business.schema';
import { Contact, ContactDocument } from 'control-risk/schemas/contact.schema';
@Injectable()
export class BusinessService {
  constructor(
    @InjectModel(Business.name) private readonly model: Model<BusinessDocument>,
    @InjectModel(Contact.name)
    private readonly contactModel: Model<ContactDocument>,
  ) {}

  async create(businessDto: BusinessDTO): Promise<BusinessDocument> {
    let slug = businessDto.name.replace(/^\s+|\s+$/g, '');
    slug = slug.toLowerCase();
    slug = slug
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    const newBusiness = new this.model({ ...businessDto, slug, extraMode: 0 });
    return newBusiness.save();
  }
  async getIndicators(businessId: string) {
    const queryagg: PipelineStage[] = [
      {
        $match: {
          _id: new Types.ObjectId(businessId),
        },
      },
      {
        $lookup: {
          from: 'agencies',
          localField: '_id',
          foreignField: 'business',
          pipeline: [
            {
              $group: {
                _id: '$business',
                agencies: { $push: '$_id' },
                totalSA: { $sum: '$numSecurityAgent' },
                totalGL: { $sum: '$numGroupLeader' },
                totalPPI: { $sum: '$numPpi' },
                totalMA: { $sum: '$numMotorAgent' },
                totalDR: { $sum: '$numDriver' },
                totalPA: { $sum: '$numPreventionAgent' },
              },
            },
          ],
          as: 'agencies',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'agencies.agencies',
          foreignField: 'assignment.agency',
          let: { agency: { $arrayElemAt: ['$agencies.agencies', 0] } },
          pipeline: [
            {
              $match: {
                $expr: { $gt: [{ $size: { $ifNull: ['$$agency', []] } }, 0] },
              },
            },
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
              total: { $arrayElemAt: ['$agencies.totalGL', 0] },
            },
            { code: 9, total: { $arrayElemAt: ['$agencies.totalSA', 0] } },
            { code: 10, total: { $arrayElemAt: ['$agencies.totalPPI', 0] } },
            { code: 11, total: { $arrayElemAt: ['$agencies.totalMA', 0] } },
            { code: 12, total: { $arrayElemAt: ['$agencies.totalDR', 0] } },
            { code: 13, total: { $arrayElemAt: ['$agencies.totalPA', 0] } },
          ],
        },
      },
    ];
    const data = await this.model.aggregate(queryagg);
    return data[0];
  }
  async findAll(): Promise<BusinessDocument[]> {
    return this.model.find();
  }

  async findContacts(business): Promise<BusinessDocument[]> {
    return this.model.aggregate([
      {
        $match: {
          slug: business.slug,
        },
      },
      {
        $lookup: {
          from: 'contacts',
          localField: '_id',
          foreignField: 'bussiness',
          as: 'contactsInfo',
        },
      },
      {
        $unwind: {
          path: '$contactsInfo',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          contactName: '$contactsInfo.contactName',
          contactEmail: '$contactsInfo.contactEmail',
          contactPhone: '$contactsInfo.contactPhone',
        },
      },
    ]);
  }

  async findContactsTable(businessDto): Promise<any> {
    const npagina =
      (businessDto.pagination.currentPage - 1) * businessDto.pagination.perPage;
    const filters = getFilters(businessDto.params);
    if (!businessDto.seeAll) {
      filters.push({ active: true });
    }
    const queryagg: PipelineStage[] = [
      {
        $match: {
          _id: businessDto._id,
        },
      },
      {
        $lookup: {
          from: 'contacts',
          localField: '_id',
          foreignField: 'bussiness',
          as: 'contactsInfo',
        },
      },
      {
        $unwind: {
          path: '$contactsInfo',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: '$contactsInfo._id',
          contactName: '$contactsInfo.contactName',
          contactEmail: '$contactsInfo.contactEmail',
          contactPhone: '$contactsInfo.contactPhone',
        },
      },
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [
            { $skip: npagina },
            { $limit: businessDto.pagination.perPage },
          ],
        },
      },
    ];
    const modelos = await this.model.aggregate(queryagg);
    const datafinal = {
      data: modelos[0].data,
      totalRegistros: modelos[0].metadata[0]?.total
        ? modelos[0].metadata[0].total
        : 0,
    };
    return datafinal;
  }
  async createContact(contact) {
    return this.contactModel.create(contact);
  }

  async updateContact(_id: any, contact: any) {
    return this.contactModel.updateOne(_id, { $set: contact });
  }

  async findWithFilter(
    businessDto: filterBusinessDTO,
  ): Promise<{ data: BusinessDocument[]; totalRegistros: number }> {
    const npagina =
      (businessDto.pagination.currentPage - 1) * businessDto.pagination.perPage;
    const filters = getFilters(businessDto.params);
    if (!businessDto.seeAll) {
      filters.push({ active: true });
    }
    const queryagg: PipelineStage[] = [
      {
        $sort: {
          createdAt: 1,
        },
      },
      {
        $lookup: {
          from: 'agencies',
          localField: '_id',
          foreignField: 'business',
          pipeline: [
            {
              $group: {
                _id: '$business',
                agencies: { $push: '$_id' },
                totalSA: { $sum: '$numSecurityAgent' },
                totalGL: { $sum: '$numGroupLeader' },
                totalPPI: { $sum: '$numPpi' },
                totalMA: { $sum: '$numMotorAgent' },
                totalDR: { $sum: '$numDriver' },
                totalPA: { $sum: '$numPreventionAgent' },
              },
            },
          ],
          as: 'agencies',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'agencies.agencies',
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
          assignedAgents: {
            $cond: [
              { $gte: [{ $size: '$agencies.agencies' }, 1] },
              { $arrayElemAt: ['$assignedAgents.count', 0] },
              0,
            ],
          },
          totalAgents: {
            $sum: [
              { $arrayElemAt: ['$agencies.totalSA', 0] },
              { $arrayElemAt: ['$agencies.totalGL', 0] },
              { $arrayElemAt: ['$agencies.totalPPI', 0] },
              { $arrayElemAt: ['$agencies.totalMA', 0] },
              { $arrayElemAt: ['$agencies.totalDR', 0] },
              { $arrayElemAt: ['$agencies.totalPA', 0] },
            ],
          },
          name: '$name',
          nickname: '$nickname',
          active: '$active',
          extraMode: '$extraMode',
          slug: '$slug',
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
          $and: filters,
        },
      },
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [
            { $skip: npagina },
            { $limit: businessDto.pagination.perPage },
          ],
        },
      },
    ];
    const modelos = await this.model.aggregate(queryagg);
    const datafinal = {
      data: modelos[0].data,
      totalRegistros: modelos[0].metadata[0]?.total
        ? modelos[0].metadata[0].total
        : 0,
    };
    return datafinal;
  }

  async listAll() {
    return this.model.aggregate([
      {
        $match: { active: true },
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
  async findOne(id: string): Promise<BusinessDocument> {
    return this.model.findOne({ _id: id, active: true });
  }
  async findOneByParams(payload: Partial<Business>) {
    return this.model.findOne(payload);
  }
  async filters(page: number, limit: number, filter: string): Promise<any> {
    const skip = (page - 1) * limit;
    const nextPage = page + 1;
    const lastPage = page == 1 || page == 0 ? 1 : page - 1;
    return {
      docs: this.model
        .find({
          $or: [
            { name: { $regex: filter, $options: 'si' } },
            { nickname: { $regex: filter, $options: 'si' } },
            { createdBy: { $regex: filter, $options: 'si' } },
          ],
        })
        .skip(skip)
        .limit(limit)
        .exec(),
      page,
      pageSize: limit,
      nextPage,
      lastPage,
    };
  }
  async update(
    id: string,
    businessDto: BusinessDTO,
  ): Promise<BusinessDocument> {
    const updateBusiness = { ...businessDto };
    return this.model.findByIdAndUpdate(id, updateBusiness, { new: true });
  }

  async inactiveBusiness(id: string): Promise<BusinessDocument> {
    return this.model.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          active: false,
        },
      },
    );
  }

  async findConfig(id: string) {
    return this.model.findById(id, {
      extraMode: '$extraMode',
      baseSalary: '$baseSalary',
      extraSalary: '$extraSalary',
      nigthlyExtraSalary: '$nightlyExtraSalary',
      customerPayment: '$customerPayment',
    });
  }

  async updateConfig(id: string, payload: any): Promise<any> {
    return this.model.updateOne({ _id: id }, payload);
  }

  /*async delete(id: string, flag: boolean): Promise<any> {
    if (flag)
      return this.model.findOneAndUpdate(
        { _id: id },
        { $set: { deleted: true } },
      );
    else return this.model.findOneAndDelete({ _id: id });
  }*/
  /*   async findAllAgencies(id: string): Promise<AgencyDocument[]> {
    return this.agencies.find({ business: id });
        const Bus = await this.model
      .findOne({ _id: id, active: true })
      .populate<{ agencies: AgencyDocument[] | undefined }>('agencies')
      .exec();
    // return !!Bus ? Bus.agencies : [];
  } */
}
