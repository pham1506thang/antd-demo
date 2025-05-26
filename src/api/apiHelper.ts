import type { FilterField, PaginationParams } from '../models/pagination';

export const convertFiltersToParams = (filters: Record<string, any>): FilterField[] => {
  return Object.entries(filters)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([field, value]) => {
      if (Array.isArray(value)) {
        return {
          field,
          operator: 'in',
          value: value,
        };
      }
      return {
        field,
        operator: 'eq',
        value: value,
      };
    });
};

export const buildQueryString = (params: PaginationParams): string => {
  const queryParts: string[] = [];

  if (params.page) {
    queryParts.push(`page=${params.page}`);
  }
  if (params.limit) {
    queryParts.push(`limit=${params.limit}`);
  }
  if (params.search) {
    queryParts.push(`search=${encodeURIComponent(params.search)}`);
  }

  if (params.sorts?.length) {
    const sortString = params.sorts
      .map(sort => `${sort.field}:${sort.order}`)
      .join(',');
    queryParts.push(`sort=${sortString}`);
  }

  if (params.filters?.length) {
    params.filters.forEach(filter => {
      const value = Array.isArray(filter.value) 
        ? filter.value.join(',')
        : filter.value;
      queryParts.push(`${filter.field}${filter.operator ? `:${filter.operator}` : ''}=${value}`);
    });
  }

  return queryParts.length ? `?${queryParts.join('&')}` : '';
};
