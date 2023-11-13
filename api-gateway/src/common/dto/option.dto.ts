import { DefaultDTO } from './default.dto';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class OptionDto extends DefaultDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly label: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly value: string;
  @ApiProperty()
  @IsArray()
  readonly parent: string;
}
