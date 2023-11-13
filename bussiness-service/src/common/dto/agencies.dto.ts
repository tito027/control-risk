import { DefaultDto } from './default.dto';
import { ZonesEnum } from '../enums/zones.enum';

export class AgenciesDTO extends DefaultDto {
  readonly name: string;
  readonly zone: ZonesEnum;
  readonly nickname: string;
  readonly business: string;
  readonly groupLeader: number;
  readonly numPpi: number;
  readonly numSecurityAgent: number;
  readonly supervisor: string;
}
export class filterAgenciesDTO {
  readonly seeAll:boolean;
  readonly pagination: pagination;
  readonly params: any;
}
class pagination {
  readonly perPage: number;
  readonly currentPage: number;
}