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

export class NewsDTO extends DefaultDTO {
  @ApiProperty()
  @IsString()
  @Length(10, 200)
  description: string;

  @ApiProperty()
  @IsBoolean()
  is_new: boolean;

  @IsUUID()
  @ApiProperty()
  user_id: ObjectId;

  @IsUUID()
  @ApiProperty()
  agent_id?: ObjectId;

  @IsUUID()
  @ApiProperty()
  to_user?: ObjectId;

  @IsUUID()
  @ApiProperty()
  fullname: string;
}

export class AgentIdDTO {
  agentId: string;
  agency?: string;
}
