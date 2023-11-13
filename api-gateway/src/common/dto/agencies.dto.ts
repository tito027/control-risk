import { DefaultDTO } from './default.dto';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ZonesEnum } from '../Constants';
import { ApiProperty } from '@nestjs/swagger';

export class AgenciesDTO extends DefaultDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;
  @ApiProperty()
  @IsEnum(ZonesEnum)
  @IsNotEmpty()
  readonly zone: ZonesEnum;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly nickname: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly businessId: string;
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  readonly groupLeader: number;
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  readonly ppi: number;
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  readonly securityAgent: number;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly supervisorId: string;
}
export class filterAgenciesDTO {
  readonly seeAll:boolean;
  readonly pagination: pagination;
  readonly params: any;
}
class pagination {
  readonly perPage: number;
  readonly currentPage: number;
}
