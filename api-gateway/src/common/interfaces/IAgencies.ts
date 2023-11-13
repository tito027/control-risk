import { IDefault } from './IDefault';
import { ZonesEnum } from '../Constants';

export interface IAgencies extends IDefault {
  readonly name: string;
  readonly zone: ZonesEnum;
  readonly nickname: string;
  readonly businessId: string;
  readonly groupLeader: number;
  readonly ppi: number;
  readonly securityAgent: number;
  readonly supervisorId: string;
}
