import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReportsTypeMessage } from 'src/common/Constants';
import { ClientProxyControl } from 'src/common/proxy/client.proxy';
import { ReportsTypeDTO } from './reportsType.dto';

@ApiTags('ReportsType')
@Controller('reports')
export class ReportsTypeController {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly clientProxy: ClientProxyControl,
  ) {}

  public publisher = this.clientProxy.clientProxyAgent(this.amqpConnection);

@Get('/types')
  tryReportsTypeData(@Query() query: Partial<ReportsTypeDTO>) {
    return this.publisher(ReportsTypeMessage.GET_REPORTS_TYPE_DATA, query);
  }
}
