import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Body, Controller, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AgentMessage } from 'src/common/Constants';
import { ClientProxyControl } from 'src/common/proxy/client.proxy';

@ApiTags('Workshifts')
@Controller('workshifts')
export class WorkShiftController {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly clientProxy: ClientProxyControl,
  ) {}

  public publisher = this.clientProxy.clientProxyAgent(this.amqpConnection);

  @Post('/workdays/table/:agency_id?')
  tryGetWorkdayData(@Body() payload: any, @Param() params: any) {
    return this.publisher(AgentMessage.GET_WORKSHIFT_WORKDAY_DATA, {
      ...payload,
      ...params,
    });
  }

  @Post('/workdays')
  trycreateWorkdays(@Body() payload: any) {
    console.log(payload);
    return this.publisher(AgentMessage.CREATE_WORKSHIFTS, payload);
  }

  @Put('/workdays')
  tryupdateWorkdays(@Body() payload: any) {
    console.log(payload);
    return this.publisher(AgentMessage.UPDATE_WORKSHIFTS, payload);
  }
}
