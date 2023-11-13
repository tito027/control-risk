import { DefaultDto } from './default.dto';

export class BusinessDTO extends DefaultDto {
  readonly name: string;
  readonly nickname: string;
  readonly image: boolean;
}

export class filterBusinessDTO {
  readonly seeAll: boolean;
  readonly pagination: pagination;
  params: any;
}
class pagination {
  readonly perPage: number;
  readonly currentPage: number;
}
