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
import { Payload } from '@nestjs/microservices';

import { ApiTags } from '@nestjs/swagger';
import { AgentMessage, RequestMessage } from 'src/common/Constants';
import { AgentAgencyDTO, AgentIdDTO } from 'src/common/dto/holiday.dto';
import { ClientProxyControl } from 'src/common/proxy/client.proxy';

@ApiTags('Agent')
@Controller('agents/agencies')
export class AgentController {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly clientProxy: ClientProxyControl,
  ) {}

  public publisher = this.clientProxy.clientProxyAgent(this.amqpConnection);

  @Get('/dropdown/:user?')
  tryGetAgencyDropdownData(@Param() params: any, @Query() query: any) {
    console.log({ ...params, ...query });
    return this.publisher(AgentMessage.GET_AGENTS_AGENCIES_DROPDOWN_DATA, {
      ...params,
      ...query,
    });
  }

  @Get('/exports/workshifts/excel/:id?')
  tryGetAgencyWorkshiftExportExcelData(@Param() params: Partial<any>) {
    return this.publisher(
      AgentMessage.GET_AGENTS_AGENCIES_EXPORT_EXCEL_DATA,
      params,
    );
  }

  @Get('/exports/workshifts/excel/actual/price/:id?')
  tryGetAgencyWorkshiftActualPriceExportExcelData(
    @Param() params: Partial<any>,
  ) {
    return this.publisher(
      AgentMessage.GET_AGENTS_AGENCIES_EXPORT_ACTUAL_PRICE_EXCEL_DATA,
      params,
    );
  }

  @Post('/table')
  tryGetData(@Body() payrollInfo: Partial<any>) {
    return this.publisher(AgentMessage.GET_AGENTS_DATA, payrollInfo);
  }
  @Put('/update/')
  update(@Body() { id, agency }: any) {
    return this.publisher(AgentMessage.UPDATE_AGENT_DATA, {
      id,
      agency,
    });
  }
}
