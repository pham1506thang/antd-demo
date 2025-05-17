import type { TablePaginationConfig } from "antd/es/table";
import type { FilterValue, SorterResult } from "antd/es/table/interface";

export interface SortField {
  field: string;
  order: 'ascend' | 'descend';
}

export interface FilterField {
  field: string;
  value: FilterValue;
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