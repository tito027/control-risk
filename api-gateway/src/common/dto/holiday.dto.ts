import { DefaultDTO } from './default.dto';
import {
  IsBoolean,
  IsNumber,
  IsString,
  IsNotEmpty,
  IsDate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DiscountTypeDocument } from 'control-risk/schemas/discountType.schema';
import { UserDocument } from 'control-risk/user.schema';
import { PayrollConfigDocument } from 'control-risk/schemas/payrollConfig.schema';
import { ObjectId } from 'mongoose';

export class AgentAgencyDTO {
  @ApiProperty()
  @IsString()
  _id: string;
  @ApiProperty()
  @IsString()
  assignment: string;
  @ApiProperty()
  @IsString()
  agency_name: string;
  @ApiProperty()
  @IsString()
  user_fullname: string;
}

export class PayrollCloseDTO {
  user: string;
}

export class DiscountTypeDTO {
  readonly code: number;
  readonly description: string;
  readonly active: Boolean;
  readonly is_scheduled: Boolean;
}

export class DiscountDTO extends DefaultDTO {
  @ApiProperty()
  payroll_config: PayrollConfigDocument;

  @ApiProperty()
  @IsString()
  value: string;

  @ApiProperty()
  @IsDate()
  date: Date;

  @ApiProperty()
  discount_type: DiscountTypeDocument;

  @ApiProperty()
  by_user: UserDocument;
}

export class CreatePayrollDiscountDTO extends DefaultDTO {
  @ApiProperty()
  @IsString()
  user: string;

  @ApiProperty()
  @IsNumber()
  value: number;

  @ApiProperty()
  @IsNumber()
  discount: number;
}

export class CreatePayrollGratificationDTO extends DefaultDTO {
  @ApiProperty()
  @IsString()
  user: string;

  @ApiProperty()
  @IsNumber()
  value: number;

  @ApiProperty()
  @IsNumber()
  gratification: number;
}

export class ScheduledDiscountDTO {
  active: boolean;
  first_fortnight: boolean;
  second_fortnight: boolean;
  scheduled_value: number;
  init_date: Date;
  end_date: Date;
  user: string;
  by_user: string;
  discount_type: string;
}

export class ScheduledGratificationDTO {
  active: boolean;
  first_fortnight: boolean;
  second_fortnight: boolean;
  scheduled_value: number;
  init_date: Date;
  end_date: Date;
  user: string;
  by_user: string;
  gratification_type: string;
}
export class AgentIdDTO {
  agentId: string;
  agency?: string;
}
