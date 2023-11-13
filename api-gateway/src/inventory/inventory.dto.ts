import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { AgencyDocument } from 'control-risk/schemas/agency.schema';
import { UserDocument } from 'control-risk/schemas/user.schema';

export class InventoryDTO {
  @IsNotEmpty({ message: 'El campo agency debe ser un AgencyDocument' })
  readonly agency: AgencyDocument;

  @IsNotEmpty({ message: 'El campo user debe ser un UserDocument' })
  readonly user: UserDocument;

  @IsString({ message: 'El campo status es requerido' })
  @IsNotEmpty({ message: 'El campo de status es requerido' })
  readonly status: String;

  @IsNotEmpty()
  @IsDate()
  readonly date: Date;
}
