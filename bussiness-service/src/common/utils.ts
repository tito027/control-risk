import { Types } from 'mongoose';
import { IQuery, IStrictQuery } from './dto/default.dto';
import { PaginateQuery } from 'nestjs-paginate';

export function getStrictMatchs<T>(query: IStrictQuery<T>) {
  if (!query) return [{}];
  const filters = Object.entries<IQuery>(query).map(([key, param]) => {
    switch (param.type) {
      case 'string':
        return {
          [key]: { $in: param.value.map((filter) => new RegExp(filter, 'i')) },
        };
      case 'ObjectId':
        return {
          [key]: {
            $in: param.value.map((filter) => new Types.ObjectId(filter)),
          },
        };
      case 'date':
        return {
          $or: param.value.map((filter) => ({
            [key]: { $gte: new Date(filter[0]), $lte: new Date(filter[1]) },
          })),
        };
    }
  });
  return filters.length ? filters : [{}];
}

/* export function getPagination(pagination: PaginateQuery) {
  return 
} */
export function getFilters(params: any): any[] {
  if (!params) return [{}];
  const filters = Object.keys(params).map((param) => {
    let dateFilter = false;
    const regexs = params[param].map((filter) => {
      if (Array.isArray(filter)) {
        dateFilter = true;
        return {
          [param]: { $gte: new Date(filter[0]), $lte: new Date(filter[1]) },
        };
      } else if (typeof filter === 'object') {
        switch (filter.type) {
          case 'ObjectId':
            return new Types.ObjectId(filter.value);
          default:
            break;
        }
      } else return new RegExp(filter.trim(), 'i');
    });
    if (dateFilter) return { $or: regexs };
    else return { [param]: { $in: regexs } };
  });

  return filters.length > 0 ? filters : [{}];
}
