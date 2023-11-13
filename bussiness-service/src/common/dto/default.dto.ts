export class DefaultDto {
  readonly active: boolean;
  readonly createdBy: string;
}

export type IQuery = {
  type: 'string' | 'date' | 'ObjectId';
  value: string[] | string[][];
};
export type IStrictQuery<T> = {
  [K in keyof Partial<T>]: IQuery;
};
export interface Pagination {
  perPage: number;
  currentPage: number;
  perPageOptions: number[];
  total: number;
}
export interface BasePayload<T> {
  user: string;
  pagination: Pagination;
  pag: number;
  params: Params<T>;
  strict?: IStrictQuery<T>;
  seeAll: boolean;
}
export type Params<T = object> = Partial<T>;
