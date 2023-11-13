import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { Controller } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { RabbitMQ, ReasonMessage } from 'src/common/Constants';
import { ReasonsDTO } from './reasons.dto';
import { ReasonsService } from './reasons.service';

function ReasonsExchange(params: { pattern: string }) {
  return RabbitRPC({
    exchange: RabbitMQ.ReasonsQueue,
    routingKey: params.pattern,
  });
}

@Controller('reasons')
export class ReasonsController {
  constructor(private readonly reasonsService: ReasonsService) {}

  @ReasonsExchange({ pattern: ReasonMessage.FIND_ALL })
  async findAll(@Payload() reasonDTO: ReasonsDTO) {
    const reasons = await this.reasonsService.findByType(reasonDTO.type);
    return reasons.map((reason) => {
      return {
        _id: reason._id,
        reason: reason.reason,
      };
    });
  }
}
