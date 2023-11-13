import { DefaultDTO } from './default.dto';
import {
  IsBoolean,
  IsNumber,
  IsString,
  IsNotEmpty,
  IsAlphanumeric,
  IsDate,
  IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DiscountTypeDocument } from 'control-risk/schemas/discountType.schema';
import { UserDocument } from 'control-risk/user.schema';
import { PayrollConfigDocument } from 'control-risk/schemas/payrollConfig.schema';

export class PayrollDTO extends DefaultDTO {
  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsNumber()
  init_date: number;

  @ApiProperty()
  @IsNumber()
  end_date: number;

  @ApiProperty()
  @IsBoolean()
  status: Boolean;
}

export class AssignMassiveDiscountDTO {
  users: string[][];
  discount_type: string;
  value: string;
  is_pending: boolean;
  is_rejected: boolean;
  description?: string;
}
export class GratificationAssign {
  by_user: string;
  description: string;
  gratification_type: string;
  is_pending: false;
  rejected: false;
  user: string;
  value: string;
}
export class AssignMassiveGratificationDTO {
  users: string[][];
  gratification_type: string;
  value: string;
  is_pending: boolean;
  is_rejected: boolean;
  description?: string;
}
export class CreateMassiveDiscountDTO {
  user: string[][];
  discount_type_name: string;
  value: string;
  date: Date;
  by_user: string;
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

  @ApiProperty()
  is_pending: boolean;

  @ApiProperty()
  is_rejected: boolean;
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

export class TableFilter {
  user: string;
  pagination: {
    perPage: number;
    currentPage: number;
    perPageOptions: number[];
    total: number;
  };
  pag: number;
  params: {};
  seeAll: boolean;
}
