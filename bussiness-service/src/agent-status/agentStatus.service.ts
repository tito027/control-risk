import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import {
  AgentStatus,
  AgentStatusDocument,
} from 'control-risk/schemas/agentStatus.schema';
import { getFilters } from 'src/common/utils';
import { AgentStatusValues } from 'src/common/Constants';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AgentStatusService {
  constructor(
    @InjectModel(AgentStatus.name)
    private readonly model: Model<AgentStatusDocument>,
    private readonly userService: UsersService,
  ) {}

  async updateAgentStatus(status: AgentStatus) {
    const data = { status: AgentStatusValues[status.code], ...status }
    await this.userService.updateUserActive(status.user, [2, 5, 6].includes(status.code) ? false : true)
    await this.model.updateMany(
      { user: status.user, active: true },
      { active: false },
    );
    return this.model.create(data);
  }

  async listByCarnet(userId: string, data: any) {
    const totalSkip =
      (data.pagination.currentPage - 1) * data.pagination.perPage;
    const filters = getFilters(data.params);
    const query: PipelineStage[] = [
      {
        $match: {
          user: userId,
          $and: filters,
        },
      },
      {
        $sort: {
          active: -1,
          createdAt: -1,
        },
      },
      {
        $project: {
          status: '$status',
          reason: '$reason',
          comment: '$comment',
          date: '$date',
          active: '$active',
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
