import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Salary, SalaryDocument } from 'control-risk/schemas/salaries.schema';
import { Model, PipelineStage, Types } from 'mongoose';
import { BasePayload } from 'src/common/dto/default.dto';
import { getStrictMatchs, getFilters } from 'src/common/utils';
import { inspect } from 'util';

@Injectable()
export class SalariesService {
  constructor(
    @InjectModel(Salary.name)
    private readonly model: Model<SalaryDocument>,
  ) {}

  async updateMany(params: { [k: string]: Partial<Salary> }): Promise<any[]> {
    return Promise.all(
      Object.entries(params).map(([key, value]) =>
        this.model.updateOne({ _id: new Types.ObjectId(key) }, { $set: value }),
      ),
    );
  }
  async findAll(params: BasePayload<Salary>) {
    const npagina =
      (params.pagination.currentPage - 1) * params.pagination.perPage;
    const strictQuery = getStrictMatchs(params.strict ?? {});
    const query = getFilters(params.params ?? {});
    const totalDocs = await this.model.count();
    const agg: PipelineStage[] = [
      {
        $match: {
          $and: strictQuery,
        },
      },
      {
        $match: {
          $and: query,
        },
      },
      {
        $skip: npagina,
      },
    ];
    if (params.pagination.perPage)
      agg.push({ $limit: params.pagination.perPage });
    console.group('*** aggregation ***');
    console.log(
      inspect(agg, {
        depth: null,
        colors: true,
        showHidden: false,
      }),
    );
    console.groupEnd();
    const matchDocs = await this.model.aggregate(agg);
    return {
      data: matchDocs,
      totalRegistros: totalDocs,
    };
  }

  async findMinimumSalary() {
    return this.model.findOne({ code: 0 })
  }
}
