import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  } from 'class-validator';

export class ReportsTypeDTO {
  @IsNotEmpty({ message: 'El campo de name es requerido' })
  readonly name: string;

  @IsNotEmpty({ message: 'El campo active es requerido' })
  @IsBoolean()
  readonly active: boolean;

}