import { DefaultDTO } from './default.dto';
import {
  IsBoolean,
  IsNumber,
  IsString,
  IsNotEmpty,
  IsDate,
  Length,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DiscountTypeDocument } from 'control-risk/schemas/discountType.schema';
import { UserDocument } from 'control-risk/user.schema';
import { PayrollConfigDocument } from 'control-risk/schemas/payrollConfig.schema';
import { ObjectId, Types } from 'mongoose';

export class ReportsDTO extends DefaultDTO {
  @ApiProperty()
  @IsString()
  @Length(10, 200)
  details: string;

  @IsUUID()
  @ApiProperty()
  user_id: ObjectId;

  @IsUUID()
  @ApiProperty()
  document_id?: ObjectId;
}

export class AgentIdDTO {
  agentId: string;
  agency?: string;
}
