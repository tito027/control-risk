import { Injectable } from '@nestjs/common';
import { PsychicDto } from '../common/dto/psychic.dto';
import { AnswerDto } from '../common/dto/answer.dto';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Psychic, PsychicDocument } from 'control-risk/schemas/psychic.schema';
import { Answer, AnswerDocument } from 'control-risk/schemas/answers.schema';

@Injectable()
export class PsychicService {
  constructor(
    @InjectModel(Psychic.name)
    private readonly model: Model<PsychicDocument>,
    @InjectModel(Answer.name)
    private readonly modelAnswer: Model<AnswerDocument>,
  ) {}
  async create(createPsychicDto: PsychicDto): Promise<PsychicDocument> {
    return new this.model({ ...createPsychicDto }).save();
  }
  async findAll(): Promise<PsychicDocument[]> {
    return this.model.find({ active: true });
  }
  async findByFilter(dto) {
    const npagina = (dto.pagination.currentPage - 1) * dto.pagination.perPage;
    let filterMatch = {};
    const $and = [];
    if (!dto.seeAll) {
      $and.push({ active: true });
    }
    if (dto.params.name) {
      const $or = [];
      dto.params.name.forEach((element) => {
        $or.push({ name: new RegExp(element, 'i') });
      });
      $and.push({ $or: $or });
    }
    if (dto.params.nickname) {
      const $or = [];
      dto.params.nickname.forEach((element) => {
        $or.push({ nickname: new RegExp(element, 'i') });
      });
      $and.push({ $or: $or });
    }
    if ($and.length > 0) filterMatch = { $and };
    const queryagg = [
      {
        $project: {
          _id: 1,
          name: 1,
          indication: 1,
          active: 1,
          comment: 1,
          dynamicInput: 1,
        },
      },
      {
        $match: {
          ...filterMatch,
        },
      },
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [{ $skip: npagina }, { $limit: dto.pagination.perPage }],
        },
      },
    ];
    const data = await this.model.aggregate(queryagg);
    const finalData = {
      data: data[0].data,
      totalRegistros: data[0].metadata[0]?.total ?? 0,
    };
    return finalData;
  }
  async findList(): Promise<PsychicDocument[]> {
    return await this.model.find({ active: true });
  }
  async findOne(id: string): Promise<PsychicDocument> {
    return await this.model.findOne({ _id: id, active: true });
  }

  async update(
    id: string,
    psychic: Partial<PsychicDocument>,
  ): Promise<PsychicDocument> {
    console.log(psychic);
    return this.model.findByIdAndUpdate(id, { ...psychic });
  }

  async inactivePsychic(id: string): Promise<PsychicDocument> {
    return this.model.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          active: false,
        },
      },
    );
  }
  async register(createAnswerDto: AnswerDto): Promise<AnswerDocument> {
    return new this.modelAnswer({ ...createAnswerDto }).save();
  }
  async findAnswerListByUser(body): Promise<AnswerDocument[]> {
    const result = await this.modelAnswer
      .find({ active: true, user: body?.userAnswer })
      .populate('test')
      .populate({ path: 'createdBy', select: 'carnet username' })
      .select('user test createdAt')
      .sort({ createdAt: -1 });
    return result;
  }
  async findAnswerById(body): Promise<AnswerDocument> {
    const result = await this.modelAnswer
      .findOne({
        active: true,
        _id: body?.answerID,
      })
      .populate({ path: 'createdBy', select: 'carnet username' });
    return result;
  }
}
