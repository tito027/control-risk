import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Body, Controller, Delete, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReportsMessage } from 'src/common/Constants';
import { ReportsDTO } from 'src/common/dto/reports.dto';
import { ClientProxyControl } from 'src/common/proxy/client.proxy';

@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly clientProxy: ClientProxyControl,
  ) {}

  public publisher = this.clientProxy.clientProxyAgent(this.amqpConnection);

  @Post('/table')
  getReportsData(@Body() reportsInfo: any, @Query() params: any) {
    return this.publisher(ReportsMessage.GET_REPORTS_DATA, {
      ...reportsInfo,
      query: params.type,
    });
  }

  @Post()
  addReportsData(@Body() reportsInfo: ReportsDTO) {
    return this.publisher(ReportsMessage.CREATE_REPORTS_DATA, {
      ...reportsInfo,
    });
  }

  @Put('/:_id')
  updateReportsData(@Param() params: any, @Body() reportsInfo: any) {
    return this.publisher(ReportsMessage.UPDATE_REPORTS_DATA, {
      ...params,
      ...reportsInfo,
    });
  }

  @Delete('/:_id')
  deleteReportsData(@Param('_id') _id: string) {
    return this.publisher(ReportsMessage.DELETE_REPORTS_DATA, _id);
  }
}
