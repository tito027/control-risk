import { IsNotEmpty, IsString } from 'class-validator';
import { DefaultDTO } from './default.dto';
import { ApiProperty } from '@nestjs/swagger';

export class BusinessDTO extends DefaultDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly name: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly nickname: string;
}

export class filterBusinessDTO {
  readonly seeAll:boolean;
  readonly pagination: pagination;
}
class pagination {
  readonly perPage: number;
  readonly currentPage: number;
}
