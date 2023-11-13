import { DefaultDTO } from './default.dto';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PhysicalPositionDTO extends DefaultDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  as8: number;
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  as12: number;
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  as24: number;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  agencyId: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  schedulesId: string;
}

export class UpdateCoordinatesDTO extends DefaultDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  lat: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  lng: number;
}

export class filterPhysicalPositionsDTO {
  readonly seeAll:boolean;
  readonly pagination: pagination;
  readonly params: any;
}
class pagination {
  readonly perPage: number;
  readonly currentPage: number;
}
