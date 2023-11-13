import { DefaultDTO } from './default.dto';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SchedulesDTO extends DefaultDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  start: string;
  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  end: string;
}
