import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { IReasons } from '../interfaces/IReasons';

export class ReasonsDTO implements IReasons {
  @IsString()
  @IsIn(['position', 'time'])
  type?: 'position' | 'time';
}
