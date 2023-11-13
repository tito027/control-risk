import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Query,
  Post,
  Put,
  StreamableFile,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IConfig } from 'src/common/interfaces/config.interface';
import { ApiTags } from '@nestjs/swagger';
import { PayrollMessage } from 'src/common/Constants';
import {
  PayrollDTO,
  PayrollCloseDTO,
  DiscountDTO,
  DiscountTypeDTO,
  ScheduledDiscountDTO,
  AssignMassiveDiscountDTO,
  CreateMassiveDiscountDTO,
} from 'src/common/dto/payroll.dto';
import { ClientProxyControl } from 'src/common/proxy/client.proxy';
import { DiscountService } from './discount.service';

@ApiTags('Payroll')
@Controller('payrolls/discounts')
export class DiscountController {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly clientProxy: ClientProxyControl,
    private readonly configService: ConfigService<IConfig>,
    private readonly discountService: DiscountService,
  ) {}

  public publisher = this.clientProxy.clientProxyPayroll(this.amqpConnection);

  /** data table de tipos de descuentos */
  @Post('/types/table')
  tryPayrollDiscountsInfo(@Body() payrollInfo: PayrollDTO) {
    return this.publisher(
      PayrollMessage.GET_PAYROLL_DISCOUNT_TYPE_TABLE,
      payrollInfo,
    );
  }
  /** data table de descuentos pendientes admin */
  @Post('/pending/table/admin')
  tryPayrollDiscountsPendingAdminInfo(@Body() payrollInfo: PayrollDTO) {
    return this.publisher(
      PayrollMessage.GET_PAYROLL_DISCOUNT_PENDING_TABLE_ADMIN,
      payrollInfo,
    );
  }

  @Post('/pending/table')
  tryPayrollDiscountsPendingInfo(@Body() payrollInfo: PayrollDTO) {
    return this.publisher(
      PayrollMessage.GET_PAYROLL_DISCOUNT_PENDING_TABLE_SUPERVISOR,
      payrollInfo,
    );
  }

  /** data table de descuentos programados*/
  @Post('/scheduled/table')
  tryPayrollScheduledDiscountsInfo(@Body() payrollInfo: PayrollDTO) {
    return this.publisher(
      PayrollMessage.GET_PAYROLL_SCHEDULED_DISCOUNT_TABLE,
      payrollInfo,
    );
  }

  /** data modal de tipos de descuentos para modal */
  @Get('/modals/types')
  tryPayrollModalsDiscountsData(@Query() query: Partial<DiscountTypeDTO>) {
    return this.publisher(PayrollMessage.GET_PAYROLL_DISCOUNT_TYPE_DATA, query);
  }

  /** assign de descuento desde modal */
  @Post('/modals/assign')
  tryAssignPayrollDiscount(@Body() payrollInfo: PayrollDTO) {
    return this.publisher(PayrollMessage.ASSIGN_PAYROLL_DISCOUNT, payrollInfo);
  }

  /** assign de descuento desde modal */
  @Post('/modals/massive/assign')
  tryAssignPayrollMassiveDiscount(
    @Body() assignMassiveDiscountInfo: AssignMassiveDiscountDTO,
  ) {
    console.log(assignMassiveDiscountInfo);
    return this.publisher(
      PayrollMessage.ASSIGN_PAYROLL_MASSIVE_DISCOUNT,
      assignMassiveDiscountInfo,
    );
  }

  /** create de descuento desde modal */
  @Post('/modals')
  tryCreatePayrollDiscount(@Body() discountInfo: DiscountDTO) {
    return this.publisher(PayrollMessage.CREATE_PAYROLL_DISCOUNT, discountInfo);
  }

  /** change status gratificantes pendientes */
  @Put('/pending')
  tryChangeStatusDiscountPending(@Body() payload: any) {
    return this.publisher(PayrollMessage.PUT_PAYROLL_DISCOUNT_PENDING, payload);
  }

  /** create de tipo de descuento desde modal */
  @Post('/types/create')
  tryCreateDiscountType(@Body() payrollInfo: PayrollDTO) {
    return this.publisher(
      PayrollMessage.CREATE_PAYROLL_DISCOUNT_TYPE,
      payrollInfo,
    );
  }

  /** create de tipo de descuento desde modal */
  @Put('/types')
  tryUpdateDiscountType(@Body() discountInfo: any) {
    return this.publisher(
      PayrollMessage.UPDATE_PAYROLL_DISCOUNT_TYPE,
      discountInfo,
    );
  }

  @Post('/scheduled')
  tryCreateScheduledDiscount(@Body() scheduledDiscount: ScheduledDiscountDTO) {
    return this.publisher(
      PayrollMessage.CREATE_PAYROLL_SCHEDULED_DISCOUNT,
      scheduledDiscount,
    );
  }

  /** create de tipo de descuento desde modal */
  @Put('/scheduled')
  tryUpdateDiscountScheduledType(@Body() scheduledDiscount: any) {
    return this.publisher(
      PayrollMessage.UPDATE_PAYROLL_SCHEDULED_DISCOUNT_TYPE,
      scheduledDiscount,
    );
  }

  //----------------------------------------------------------

  @Post('/modals/massive/create')
  tryCreatePayrollMassiveDiscount(
    @Body() createMassiveDiscountInfo: CreateMassiveDiscountDTO,
  ) {
    console.log(createMassiveDiscountInfo);
    return this.publisher(
      PayrollMessage.CREATE_PAYROLL_MASSIVE_DISCOUNT,
      createMassiveDiscountInfo,
    );
  }
}
