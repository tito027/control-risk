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
import { AnswersDto } from './answers.dto';
import { ApiProperty } from '@nestjs/swagger';
export class AnswerDto extends DefaultDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly userID: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly testID: string;
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  readonly answers: AnswersDto[];
}
