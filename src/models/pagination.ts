import type { TablePaginationConfig } from "antd/es/table";

export type FilterOperator = 
  | 'eq' 
  | 'neq' 
  | 'contains' 
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'in' 
  | 'nin' 
  | 'gt' 
  | 'gte' 
  | 'lt' 
  | 'lte'
  | 'is_null'
  | 'is_not_null'
  | 'between';

type FilterValue = string | number | boolean | Date | Array<string | number | Date> | null;

export interface FilterField {
  field: string;
  operator?: FilterOperator;
  value: FilterValue;
}

type SortOrder = 'ascend' | 'descend';

export interface SortField<T> {
  field: keyof T;
  order: SortOrder;
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

export interface PaginationParams<T> {
  page: number;
  limit: number;
  sorts?: SortField<T>[];
  filters?: FilterField[];
  search?: string;
}

export interface TableParams<T> {
  pagination?: TablePaginationConfig;
  sortFields?: SortField<T>[];
  filterFields?: FilterField[];
  search?: string;
}