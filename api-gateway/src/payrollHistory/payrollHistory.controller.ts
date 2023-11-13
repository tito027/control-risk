import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Query,
  Post,
  Put,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IConfig } from 'src/common/interfaces/config.interface';
import { ApiTags } from '@nestjs/swagger';
import {
  PayrollDTO,
  PayrollCloseDTO,
  DiscountDTO,
  DiscountTypeDTO,
  ScheduledDiscountDTO,
  ScheduledGratificationDTO,
  TableFilter,
  /*CreateAgentS2DTO,
  CreateAgentS3DTO,
  OverviewDTO,
  UserIdDTO,*/
} from 'src/common/dto/payroll.dto';
import { ClientProxyControl } from 'src/common/proxy/client.proxy';
import { PayrollHistoryService } from './payrollHistory.service';
import { PayrollMessage } from 'src/common/Constants';

@ApiTags('Payroll')
@Controller('payrolls/history/')
export class PayrollHistoryController {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly clientProxy: ClientProxyControl,
    private readonly configService: ConfigService<IConfig>,
    private readonly payrollHistoryService: PayrollHistoryService,
  ) {}

  public publisher = this.clientProxy.clientProxyPayroll(this.amqpConnection);

  /**
   * PAYROLL HISTORY ROUTES
   */
  /** data para selector de planillas historicas */
  @Get('/dropdown')
  tryPayrollHistoryWithData(@Body() payrollInfo: PayrollDTO) {
    return this.publisher(
      PayrollMessage.GET_PAYROLL_HISTORY_WITH_PAYROLL_DATA,
      payrollInfo,
    );
  }

  /** planilla historicas cerradas  */
  @Post('/table/:_id?')
  tryPayrollHistoryInfo(
    @Param() params: { _id: string },
    @Body() payrollFilters: any,
  ) {
    const payload = {
      ...params,
      ...payrollFilters,
    };
    return this.publisher(PayrollMessage.GET_PAYROLL_HISTORY_DATA, payload);
  }
}
