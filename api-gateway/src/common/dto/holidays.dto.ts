import { IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

export class HolidayDTO {
  @IsNotEmpty()
  user: string;

  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @IsNotEmpty()
  @IsNumber()
  valuePerHour: number;

  @IsNotEmpty()
  @IsNumber()
  hoursWorked: number;
}
