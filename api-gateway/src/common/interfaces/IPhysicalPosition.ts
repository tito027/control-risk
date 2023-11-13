import { IDefault } from './IDefault';

export interface IPhysicalPosition extends IDefault {
  name: string;
  as8: number;
  as12: number;
  as24: number;
  agencyId: string;
  schedulesId: string;
}
