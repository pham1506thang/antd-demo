import type { FilterField } from '../models/pagination';

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

export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
      searchParams.set(key, JSON.stringify(value));
    } else {
      searchParams.set(key, String(value));
    }
  });

  return searchParams.toString() ? `?${searchParams.toString()}` : '';
};
