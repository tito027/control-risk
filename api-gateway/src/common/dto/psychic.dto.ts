import { DefaultDTO } from './default.dto';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ZonesEnum } from '../Constants';
import { OptionDto } from './option.dto';
import { ApiProperty } from '@nestjs/swagger';
export class PsychicDto extends DefaultDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly indication: string;
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  readonly questions: OptionDto[];
}
