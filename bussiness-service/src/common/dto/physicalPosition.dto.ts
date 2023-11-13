import { DefaultDto } from './default.dto';

export class PhysicalPositionDTO extends DefaultDto {
  name: string;
  latitude: number;
  longitude: number;
  numSecurityAgent8: number;
  numSecurityAgent12: number;
  numSecurityAgent24: number;
  agency: string;
  schedule: [];
}

export class UpdateCoordinatesDTO extends DefaultDto {
  id: string;
  lat: number;
  lng: number;
}

export class filterPhysicalPositionDTO {
  readonly seeAll:boolean;
  readonly pagination: pagination;
  readonly params: any;
}

class pagination {
  readonly perPage: number;
  readonly currentPage: number;
}
