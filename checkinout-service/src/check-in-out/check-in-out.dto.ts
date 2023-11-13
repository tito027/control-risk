export class TryCheckInOutDTO {
  readonly user: string;
  readonly physicalPosition: string;
  readonly latitude: number;
  readonly longitude: number;
}

export class CheckInOutDTO extends TryCheckInOutDTO {
  readonly password: string;
  readonly reasonSite?: string;
  readonly reasonTime?: string;
}

export class HistoryCheckInOutDTO {
  readonly carnet: string;
  readonly nombre: string;
  readonly posicion: string;
  readonly fechaInicio: string;
  readonly fechaFin: string;
  readonly pag: string;
  readonly user: string;
}

export class FilterHCheckInOutDTO {
  readonly seeAll: boolean;
  readonly pagination: pagination;
}

class pagination {
  readonly perPage: number;
  readonly currentPage: number;
}
