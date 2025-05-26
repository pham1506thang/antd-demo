import type { TablePaginationConfig } from "antd/es/table";

export type FilterOperator = 'eq' | 'neq' | 'contains' | 'in' | 'nin' | 'gt' | 'gte' | 'lt' | 'lte';

export interface FilterField {
  field: string;
  operator?: FilterOperator;
  value: string | number | boolean | Array<string | number>;
}

export interface SortField {
  field: string;
  order: 'ascend' | 'descend';
}

export interface PaginationResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
  sorts?: SortField[];
  filters?: FilterField[];
  search?: string;
}

export interface TableParams {
  pagination?: TablePaginationConfig;
  sortFields?: SortField[];
  filterFields?: FilterField[];
  search?: string;
}