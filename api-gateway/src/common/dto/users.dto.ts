import { DefaultDTO } from './default.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsNotEmpty, IsString } from 'class-validator';

export class UsersDto extends DefaultDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly username: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsAlphanumeric()
  readonly carnet: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly password: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly token: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsAlphanumeric()
  readonly roleId: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsAlphanumeric()
  readonly contactId: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsAlphanumeric()
  readonly businessId: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsAlphanumeric()
  readonly agencyId: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsAlphanumeric()
  readonly positionId: string;
}
