import { Controller } from '@nestjs/common';
import { EntriesService } from './entries.service';
import { EntriesDTO } from './dto/entry.dto';
import { PipelineStage } from 'mongoose';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { EntriesMessage, RabbitMQ } from 'src/common/Constants';
import { Payload } from '@nestjs/microservices';
import { getFilters } from 'src/common/utils';
import validateQuery from './queries/validate.query';
import { inspect } from 'util';

function EntriesExchange(params: { pattern: string }) {
  return RabbitRPC({
    exchange: RabbitMQ.Entries,
    routingKey: params.pattern,
  });
}
@Controller('entries')
export class EntriesController {
  constructor(private readonly entriesService: EntriesService) {}

  @EntriesExchange({ pattern: EntriesMessage.VALIDATE_LIST })
  async checkInOutHistory(@Payload() entriesDTO: EntriesDTO) {
    try {
      const npagina =
        (entriesDTO.pagination.currentPage - 1) * entriesDTO.pagination.perPage;
      const { createdAt, ...params } = entriesDTO.params;
      const matchFilters = getFilters(params);
      // matchFilters.push;
      const query: PipelineStage[] = validateQuery(matchFilters, createdAt);
      query.push({
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [{ $skip: npagina }, { $limit: entriesDTO.pagination.perPage }],
        },
      });
      console.group('**** prueba ****');
      console.log(
        inspect(query, { depth: null, colors: true, showHidden: false }),
      );

      console.groupEnd();
      const modelos = await this.entriesService.aggregate(query);
      const datafinal = {
        data: modelos[0].data,
        totalRegistros: modelos[0].metadata[0]?.total
          ? modelos[0].metadata[0].total
          : 0,
      };
      return datafinal;
    } catch (err) {
      console.log(err);
    }
  }
}
