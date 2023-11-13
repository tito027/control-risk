import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { map } from 'rxjs';
import { ReasonMessage } from 'src/common/Constants';
import { ReasonsDTO } from 'src/common/dto/reasons.dto';
import { ClientProxyControl } from 'src/common/proxy/client.proxy';

@ApiTags('Reasons')
@Controller('reasons')
export class ReasonsController {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly clientProxy: ClientProxyControl,
  ) {}
  public publisher = this.clientProxy.clientProxyReason(this.amqpConnection);

  @Post()
  findAll(@Body() reason?: ReasonsDTO) {
    return this.publisher(ReasonMessage.FIND_ALL, reason);
  }
  @Get(':type')
  findAllGet(@Param('type') type: ReasonsDTO['type']) {
    return this.publisher(ReasonMessage.FIND_ALL, { type }).pipe(
      map((reasons) => ({ data: reasons })),
    );
  }
}
