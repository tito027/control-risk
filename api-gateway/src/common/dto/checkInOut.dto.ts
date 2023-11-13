import { BasePayloadDTO, DefaultDTO } from './default.dto';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Entries } from 'control-risk/entries.schema';

export class TryCheckInOutDTO extends DefaultDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly user: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly physicalPosition: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly latitude: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly longitude: number;
}

export class HistoryCheckInOutDTO extends DefaultDTO {
  @ApiProperty()
  @IsString()
  readonly carnet: string;
  @ApiProperty()
  @IsString()
  readonly nombre: string;
  @ApiProperty()
  @IsString()
  readonly posicion: string;
  @ApiProperty()
  @IsString()
  readonly fechaInicio: string;
  @ApiProperty()
  @IsString()
  readonly fechaFin: string;
  @ApiProperty()
  @IsString()
  readonly pag: string;
}

export class EntriesDTO extends BasePayloadDTO<Entries> {}

export class CheckInOutDTO extends TryCheckInOutDTO {
  @ApiProperty()
  @IsString()
  readonly outOfTime?: string;
  @ApiProperty()
  @IsString()
  readonly outOfSite?: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
