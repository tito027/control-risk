import { DefaultDto } from './default.dto';

export class UsersDTO extends DefaultDto {
  readonly carnet: string;
  readonly pag: string;
  readonly activo: string;
}
export class OverviewDTO extends DefaultDto {
  readonly carnet: string;
}
export class FilterUserDTO {
  readonly seeAll: boolean;
  readonly pagination: pagination;
}

class pagination {
  readonly perPage: number;
  readonly currentPage: number;
}

export class UserIdDTO {
  readonly userId: string;
}
