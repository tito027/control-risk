import { IDefault } from './IDefault';

export interface ICheckInOut extends IDefault {
  user: string;
  physicalPosition: string;
  status?: boolean;
  latitude: number;
  longitude: number;
  aditionalInformation?: string;
}
