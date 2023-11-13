export interface BasePayload<T> {
  user: string;
  pagination: Pagination;
  pag: number;
  params: Params<T>;
  seeAll: boolean;
}

export interface Pagination {
  perPage: number;
  currentPage: number;
  perPageOptions: number[];
  total: number;
}

export type Params<T = object> = Partial<T>;

/* export class PaginationPayload implements Pagination {
  @IsNumber()
  perPage: number;
  @IsNumber()
  currentPage: number;
  @IsNumber({}, { each: true })
  perPageOptions: number[];
  @IsNumber()
  total: number;
}
export class BasePayloadDTO<T> implements BasePayload<T> {
  @IsString()
  user: string;
  @ValidateNested()
  pagination: PaginationPayload;
  @IsNumber()
  pag: number;
  params: Partial<T>;
  @IsBoolean()
  seeAll: boolean;
} */

/* export class DefaultDTO {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  readonly active: boolean;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly createdBy: string;
}
 */
