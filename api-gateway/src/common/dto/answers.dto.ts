import { DefaultDTO } from './default.dto';
import { IsArray, IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class AnswersDto extends DefaultDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  readonly needResponse: boolean;
  @ApiProperty()
  @IsString()
  @IsArray()
  readonly question: string;
  @ApiProperty()
  @IsString()
  @IsArray()
  readonly answer: string;
}
