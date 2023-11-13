import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { RequestMessage } from 'src/common/Constants';
import { ClientProxyControl } from 'src/common/proxy/client.proxy';

@ApiTags('Request')
@Controller('requests')
export class RequestUserController {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly clientProxy: ClientProxyControl,
  ) {}

  public publisher = this.clientProxy.clientProxyAgent(this.amqpConnection);

  @Post('/holidays/exports')
  tryGetHolidayExportData(@Body() payrollInfo: any) {
    return this.publisher(RequestMessage.GET_HOLIDAYS_EXPORT_DATA, payrollInfo);
  }

  @Post('/table')
  tryGetHolidayData(@Body() payrollInfo: Partial<any>, @Query() params: any) {
    return this.publisher(RequestMessage.GET_HOLIDAYS_DATA, {
      ...payrollInfo,
      query: params,
    });
  }

  @Get('/getData/:id')
  tryGetOneHolidayInfo(@Param('id') id: string) {
    return this.publisher(RequestMessage.GET_HOLIDAY_DATA, id);
  }

  @Delete('/:id')
  tryDeleteHoliday(@Param('id') _id: string) {
    return this.publisher(RequestMessage.DELETE_HOLIDAY_DATA, { _id });
  }

  @Put('/:_id')
  tryUpdateHolidayInfo(@Param() params: any, @Body() payload: any) {
    return this.publisher(RequestMessage.UPDATE_HOLIDAY_DATA, {
      ...params,
      ...payload,
    });
  }

  @Post('/create')
  createHolidayInfo(@Param() params: any, @Body() payload: any) {
    return this.publisher(RequestMessage.CREATE_HOLIDAY_DATA, {
      ...params,
      ...payload,
    });
  }
}
