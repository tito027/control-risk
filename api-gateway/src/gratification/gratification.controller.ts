import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Body, Controller, Get, Query, Post, Put } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IConfig } from 'src/common/interfaces/config.interface';
import { ApiTags } from '@nestjs/swagger';
import { PayrollMessage } from 'src/common/Constants';
import {
  AssignMassiveGratificationDTO,
  GratificationAssign,
  PayrollDTO,
  ScheduledGratificationDTO,
  TableFilter,
} from 'src/common/dto/payroll.dto';
import { ClientProxyControl } from 'src/common/proxy/client.proxy';
import { GratificationService } from './gratification.service';
import { HolidayDTO } from 'src/common/dto/holidays.dto';

@ApiTags('Payroll')
@Controller('payrolls/gratifications')
export class GratificationController {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly clientProxy: ClientProxyControl,
    private readonly configService: ConfigService<IConfig>,
    private readonly gratificationService: GratificationService,
  ) {}

  public publisher = this.clientProxy.clientProxyPayroll(this.amqpConnection);

  /** data table de tipos de gratificaciones */
  @Post('/types/table')
  tryPayrollGratificationsInfo(@Body() payrollInfo: PayrollDTO) {
    return this.publisher(
      PayrollMessage.GET_PAYROLL_GRATIFICATION_TYPE_TABLE,
      payrollInfo,
    );
  }

  /** data table de gratificantes programados */
  @Post('/scheduled/table')
  tryPayrollScheduledGratificationsInfo(@Body() payrollInfo: PayrollDTO) {
    return this.publisher(
      PayrollMessage.GET_PAYROLL_SCHEDULED_GRATIFICATION_TABLE,
      payrollInfo,
    );
  }

  /** data modal de tipos de gratificaciones para modal */
  @Get('/modals/types')
  tryPayrollModalGratificationsData(@Query() payrollInfo: PayrollDTO) {
    return this.publisher(
      PayrollMessage.GET_PAYROLL_GRATIFICATION_TYPE_DATA,
      payrollInfo,
    );
  }

  /** create de gratificacion desde modal */
  @Post('/modals')
  tryCreatePayrollGratification(@Body() payrollInfo: any) {
    return this.publisher(
      PayrollMessage.CREATE_PAYROLL_GRATIFICATION,
      payrollInfo,
    );
  }
  /** assign de gratificacion desde modal */
  @Post('/modals/assign')
  tryAssignPayrollGratification(
    @Body() gratificationAssignInfo: GratificationAssign,
  ) {
    return this.publisher(
      PayrollMessage.ASSIGN_PAYROLL_GRATIFICATION,
      gratificationAssignInfo,
    );
  }

  /** assign de descuento desde modal */
  @Post('/modals/massive/assign')
  tryAssignPayrollMassiveDiscount(
    @Body() assignMassiveGratificationDTO: AssignMassiveGratificationDTO,
  ) {
    console.log(assignMassiveGratificationDTO);
    return this.publisher(
      PayrollMessage.ASSIGN_PAYROLL_MASSIVE_GRATIFICATION,
      assignMassiveGratificationDTO,
    );
  }

  /** create de tipo de gratificacion desde modal */
  @Post('/types/create')
  tryCreateGratificationType(@Body() payrollInfo: PayrollDTO) {
    return this.publisher(
      PayrollMessage.CREATE_PAYROLL_GRATIFICATION_TYPE,
      payrollInfo,
    );
  }

  @Post('/holidays')
  tryCreateHolidayGratification(@Body() payload: HolidayDTO) {
    return this.publisher(
      PayrollMessage.CREATE_PAYROLL_HOLIDAY_GRATIFICATION,
      payload,
    );
  }
  /* gratificantes pendientes admin*/
  @Post('/pending/table/admin')
  tryGetGratificationsPendingAdminInfo(@Body() payrollInfo: TableFilter) {
    return this.publisher(
      PayrollMessage.GET_PAYROLL_GRATIFICATIONS_PENDING_ADMIN,
      payrollInfo,
    );
  }

  /* gratificantes pendientes supervisor*/
  @Post('/pending/table')
  tryGetGratificationsPendingSupervisorInfo(@Body() payrollInfo: TableFilter) {
    return this.publisher(
      PayrollMessage.GET_PAYROLL_GRATIFICATIONS_PENDING_SUPERVISOR,
      payrollInfo,
    );
  }
  /** change status gratificantes pendientes */
  @Put('/pending')
  tryChangeStatusGratificationPending(@Body() payload: any) {
    return this.publisher(
      PayrollMessage.PUT_PAYROLL_GRATIFICATION_PENDING,
      payload,
    );
  }

  @Post('/scheduled')
  tryCreateScheduledGratification(
    @Body() scheduledGratification: ScheduledGratificationDTO,
  ) {
    return this.publisher(
      PayrollMessage.CREATE_PAYROLL_SCHEDULED_GRATIFICATION,
      scheduledGratification,
    );
  }

  /** update de tipo de gratificante desde modal */
  @Put('/types')
  tryUpdateGratificationType(@Body() gratificationInfo: any) {
    return this.publisher(
      PayrollMessage.UPDATE_PAYROLL_GRATIFICATION_TYPE,
      gratificationInfo,
    );
  }

  /** update de tipo de gratificante recurrente desde modal */
  @Put('/scheduled')
  tryUpdateGratificationScheduledType(@Body() scheduledGratification: any) {
    return this.publisher(
      PayrollMessage.UPDATE_PAYROLL_SCHEDULED_GRATIFICATION_TYPE,
      scheduledGratification,
    );
  }
}
