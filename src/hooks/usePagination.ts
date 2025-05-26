import { useState, useCallback, useMemo, useEffect } from 'react';
import _ from 'lodash';
import type { TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import type { PaginationParams, TableParams, SortField, FilterField } from '@/models/pagination';

interface UsePaginationProps<T> {
  defaultPageSize?: number;
  defaultCurrent?: number;
  defaultSorts?: SortField[];
  defaultFilters?: FilterField[];
  defaultSearch?: string;
}

interface UsePaginationResult<T> {
  tableParams: TableParams;
  paginationParams: PaginationParams;
  handleTableChange: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T> | SorterResult<T>[],
  ) => void;
  setSearch: (search: string) => void;
}

export function usePagination<T>({
  defaultPageSize = 10,
  defaultCurrent = 1,
  defaultSorts = [],
  defaultFilters = [],
  defaultSearch = '',
}: UsePaginationProps<T> = {}): UsePaginationResult<T> {
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: defaultCurrent,
      pageSize: defaultPageSize,
    },
    sortFields: defaultSorts,
    filterFields: defaultFilters,
    search: defaultSearch,
  });

  // Debounced setSearch using useCallback and lodash.debounce
  const setSearch = useCallback(
    _.debounce((search: string) => {
      setTableParams(prev => ({
        ...prev,
        search,
        pagination: {
          ...prev.pagination,
          current: 1,
        },
      }));
    }, 400),
    []
  );

  useEffect(() => {
    return () => {
      setSearch.cancel && setSearch.cancel();
    };
  }, [setSearch]);

  // Convert table params to API pagination params
  const paginationParams: PaginationParams = useMemo(() => ({
    page: tableParams.pagination?.current || defaultCurrent,
    limit: tableParams.pagination?.pageSize || defaultPageSize,
    sorts: tableParams.sortFields,
    filters: tableParams.filterFields,
    search: tableParams.search,
  }), [tableParams, defaultCurrent, defaultPageSize]);

  const handleTableChange = useCallback(
    (
      pagination: TablePaginationConfig,
      filters: Record<string, FilterValue | null>,
      sorter: SorterResult<T> | SorterResult<T>[],
    ) => {
      // Handle multiple sorters
      const sortFields: SortField[] = Array.isArray(sorter)
        ? sorter.map(s => ({
            field: s.field as string,
            order: s.order || 'ascend',
          }))
        : sorter.field
          ? [{
              field: sorter.field as string,
              order: sorter.order || 'ascend',
            }]
          : [];

      // Handle multiple filters
      const filterFields: FilterField[] = (Object.entries(filters)
        .filter(([_, value]) => value !== null && value.length > 0) as [string, FilterValue][])
        // Convert filter values to appropriate format
        .map(([field, value]) => ({
          field,
          value: Array.isArray(value)
            ? value.filter(v => typeof v === 'string' || typeof v === 'number')
            : value,
        }));

      setTableParams({
        pagination,
        sortFields,
        filterFields,
        search: tableParams.search,
      });
    },
    [tableParams.search]
  );

  return {
    tableParams,
    paginationParams,
    handleTableChange,
    setSearch,
  };
}