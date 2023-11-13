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
import { ComplaintsMessage } from 'src/common/Constants';
import { ComplaintsDTO } from 'src/common/dto/complaints.dto';
import { ClientProxyControl } from 'src/common/proxy/client.proxy';

@ApiTags('Complaints')
@Controller('complaints')
export class ComplaintsController {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly clientProxy: ClientProxyControl,
  ) {}

  public publisher = this.clientProxy.clientProxyAgent(this.amqpConnection);

  @Post('/table')
  tryGetComplaintsData(
    @Body() payrollInfo: Partial<any>,
    @Query() params: any,
  ) {
    return this.publisher(ComplaintsMessage.GET_COMPLAINTS_DATA, {
      ...payrollInfo,
      query: params,
    });
  }

  @Get('/status')
  tryGetComplaintsTypesDropdown(@Query() params: any) {
    return this.publisher(
      ComplaintsMessage.GET_COMPLAINTS_STATUS_DROPDOWN_DATA,
      params,
    );
  }

  @Get('/getData/:id')
  tryGetOneComplaintInfo(@Param('id') id: string) {
    return this.publisher(ComplaintsMessage.GET_COMPLAINT_DATA, id);
  }

  @Delete('/:id')
  tryDeleteComplaints(@Param('id') _id: string) {
    return this.publisher(ComplaintsMessage.DELETE_COMPLAINTS_DATA, { _id });
  }

  @Put('/:_id')
  tryUpdateComplaintsInfo(
    @Param() params: any,
    @Body() payload: ComplaintsDTO,
  ) {
    return this.publisher(ComplaintsMessage.UPDATE_COMPLAINTS_DATA, {
      ...params,
      ...payload,
    });
  }

  @Post('/create')
  createComplaintsInfo(@Param() params: any, @Body() payload: ComplaintsDTO) {
    //console.log(payload.type + "     llega auth");
    return this.publisher(ComplaintsMessage.CREATE_COMPLAINTS_DATA, {
      ...params,
      ...payload,
    });
  }
}
