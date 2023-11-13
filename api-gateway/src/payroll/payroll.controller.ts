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
  StreamableFile,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createReadStream } from 'fs';
import * as path from 'path';
import { map, Observable, scheduled } from 'rxjs';
import { IConfig } from 'src/common/interfaces/config.interface';
import { ApiTags } from '@nestjs/swagger';
import { PayrollMessage, UserInformationsMessage } from 'src/common/Constants';
import {
  PayrollDTO,
  PayrollCloseDTO,
  CreatePayrollDiscountDTO,
  CreatePayrollGratificationDTO,
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
import { UserDocument } from 'control-risk/user.schema';
import { PayrollService } from './payroll.service';

@ApiTags('Payroll')
@Controller('payrolls')
export class PayrollController {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly clientProxy: ClientProxyControl,
    private readonly configService: ConfigService<IConfig>,
    private readonly payrollService: PayrollService,
  ) {}

  public publisher = this.clientProxy.clientProxyPayroll(this.amqpConnection);

  /**
   * PAYROLL ROUTES
   */
  /** planilla activa con agentes */
  @Post('/table')
  tryPayrollInfo(@Body() payrollInfo: PayrollDTO) {
    return this.publisher(PayrollMessage.FIND_ACTIVE_PAYROLL, payrollInfo);
  }

  /** planilla activa con agentes */
  @Post('/close')
  tryCloseActivePayroll(@Body() payrollInfo: any) {
    console.log(payrollInfo);
    return this.publisher(PayrollMessage.CLOSE_ACTIVE_PAYROLL, payrollInfo);
  }

  /** data modal de agentes activos configurados en una planilla */
  @Get('/modals/users')
  tryPayrollModalUsersData(
    @Body() body: PayrollDTO,
    @Query() queryParams: any,
  ) {
    return this.publisher(PayrollMessage.GET_PAYROLL_USER_DATA, {
      body,
      queryParams,
    });
  }

  /** data modal de agentes activos configurados en una planilla */
  @Get('/modals/business')
  tryPayrollModalBusinessData(@Body() business: any) {
    return this.publisher(PayrollMessage.GET_PAYROLL_BUSINESS_DATA, business);
  }

  /** data modal de agentes activos configurados en una planilla */
  @Get('/modals/departments')
  tryDepartmentData(@Query() query: any) {
    return this.publisher(PayrollMessage.GET_DEPARTMENT_DATA, query);
  }

  @Get('/modals/municipalities')
  tryMunicipalityData(@Query() query: any) {
    return this.publisher(PayrollMessage.GET_MUNICPALITY_DATA, query);
  }

  /** data modal de roles */
  @Get('/modals/roles')
  tryPayrollModalRolesData(@Body() roleInfo: any) {
    return this.publisher(PayrollMessage.GET_PAYROLL_ROLE_DATA, roleInfo);
  }

  /** data modal de zonas */
  @Get('/modals/zones')
  tryPayrollModalZonesData(@Body() zoneInfo: any) {
    return this.publisher(PayrollMessage.GET_PAYROLL_ZONE_DATA, zoneInfo);
  }

  /** data modal de agentes activos configurados en una planilla agrupados por business */
  @Get('/modals/users/group/business')
  tryPayrollModalBusinessUsersData(@Body() payrollInfo: any) {
    return this.publisher(
      PayrollMessage.GET_PAYROLL_BUSINESS_AGENCY_USER_DATA,
      payrollInfo,
    );
  }

  /** data modal de agentes activos configurados en una planilla agrupados por roles */
  @Get('/modals/users/group/roles')
  tryPayrollModalRolesUsersData(@Body() payrollInfo: any) {
    return this.publisher(
      PayrollMessage.GET_PAYROLL_ROLE_USER_DATA,
      payrollInfo,
    );
  }

  /** data modal de agentes activos configurados en una planilla agrupados por zonas */
  @Get('/modals/users/group/zones')
  tryPayrollModalZoneUsersData(@Body() payrollInfo: any) {
    return this.publisher(
      PayrollMessage.GET_PAYROLL_ZONE_USER_DATA,
      payrollInfo,
    );
  }

  /** create de planilla desde modal */
  @Post('/create')
  tryCreatePayroll(@Body() payrollInfo: PayrollDTO) {
    return this.publisher(PayrollMessage.CREATE_PAYROLL, payrollInfo);
  }

  /** data planilla exportable txt */
  @Get('/exports/:type')
  tryPayrollExportInfo(@Param() params: any) {
    return this.publisher(PayrollMessage.GET_PAYROLL_EXPORT_DATA, params);
  }

  /** validate extra mode */
  @Post('/validate/extramode')
  tryValidateExtraMode(@Body() payload) {
    return this.publisher(PayrollMessage.VALIDATE_HOURS, payload);
  }

  /** agency list */
  @Get('/agency/list')
  tryAgencyList(@Param() payload) {
    return this.publisher(PayrollMessage.GET_AGENCY_LIST, payload);
  }
}
