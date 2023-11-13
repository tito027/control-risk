import { Body, Controller, Post, Put } from '@nestjs/common';
import { SalariesService } from './salaries.service';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ClientProxyControl } from 'src/common/proxy/client.proxy';
import { SalariesMessage } from 'src/common/Constants';
import { BasePayloadDTO } from 'src/common/dto/default.dto';
import { Salary } from 'control-risk/schemas/salaries.schema';

@Controller('salaries')
export class SalariesController {
  constructor(
    private readonly salariesService: SalariesService,
    private readonly amqpConnection: AmqpConnection,
    private readonly clientProxy: ClientProxyControl,
  ) {}

  public publisher = this.clientProxy.clientProxySalaries(this.amqpConnection);

  @Put('updateMany')
  updateMany(@Body() query: BasePayloadDTO<Salary>) {
    return this.publisher(SalariesMessage.UPDATE_MANY, query);
  }
  @Post('list')
  getSalaries(@Body() query: BasePayloadDTO<Salary>) {
    return this.publisher(SalariesMessage.FIND_ALL, query);
  }
}
