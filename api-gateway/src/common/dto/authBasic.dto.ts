import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { DefaultDTO } from './default.dto';
import { ApiProperty } from '@nestjs/swagger';

export class AuthBasicDTO extends DefaultDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly carnet: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
export class QRBasicDTO extends DefaultDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(7, {
    message:
      'El codigo es demasiado corto. El largo minimo es $constraint1 caracteres, pero el valor actual es $value',
  })
  @MaxLength(7, {
    message:
      'El codigo es demasiado largo. El largo maximo es $constraint1 caracteres, pero el valor actual es $value',
  })
  readonly carnet: string;
}
