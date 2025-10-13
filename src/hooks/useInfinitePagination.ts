import { useState, useCallback, useMemo } from 'react';
import { useDebounce } from './useDebounce';
import type { SortField, FilterField } from '@/models/pagination';

export interface InfinitePaginationParams<T> {
  cursor?: string;
  limit?: number;
  search?: string;
  sorts?: SortField<T>[];
  filters?: FilterField[];
  direction?: 'next' | 'prev';
}

export interface InfinitePaginationState<T> {
  cursor: string | null;
  limit: number;
  search: string;
  sorts: SortField<T>[];
  filters: FilterField[];
  direction: 'next' | 'prev';
}

interface UseInfinitePaginationProps<T> {
  defaultLimit?: number;
  defaultSorts?: SortField<T>[];
  defaultFilters?: FilterField[];
  defaultSearch?: string;
  debounceDelay?: number;
}

interface UseInfinitePaginationResult<T> {
  state: InfinitePaginationState<T>;
  params: InfinitePaginationParams<T>;
  setCursor: (cursor: string | null) => void;
  setSearch: (search: string) => void;
  setSorts: (sorts: SortField<T>[]) => void;
  setFilters: (filters: FilterField[]) => void;
  reset: () => void;
  loadMore: () => void;
  hasNextPage: boolean;
  nextCursor: string | null;
  updatePaginationInfo: (info: { hasNextPage: boolean; nextCursor: string | null }) => void;
}

export function useInfinitePagination<T>({
  defaultLimit = 20,
  defaultSorts = [],
  defaultFilters = [],
  defaultSearch = '',
  debounceDelay = 300,
}: UseInfinitePaginationProps<T> = {}): UseInfinitePaginationResult<T> {
  const [state, setState] = useState<InfinitePaginationState<T>>({
    cursor: null,
    limit: defaultLimit,
    search: defaultSearch,
    sorts: defaultSorts,
    filters: defaultFilters,
    direction: 'next',
  });

  const [hasNextPage, setHasNextPage] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  // Debounced search
  const debouncedSearch = useDebounce(state.search, debounceDelay);

  // Convert state to API params
  const params: InfinitePaginationParams<T> = useMemo(
    () => ({
      cursor: state.cursor || undefined,
      limit: state.limit,
      search: debouncedSearch || undefined,
      sorts: state.sorts.length > 0 ? state.sorts : undefined,
      filters: state.filters.length > 0 ? state.filters : undefined,
      direction: state.direction,
    }),
    [state, debouncedSearch]
  );

  // Actions
  const setCursor = useCallback((cursor: string | null) => {
    setState(prev => ({ ...prev, cursor }));
  }, []);

  const setSearch = useCallback((search: string) => {
    setState(prev => ({
      ...prev,
      search,
      cursor: null, // Reset cursor when searching
    }));
  }, []);

  const setSorts = useCallback((sorts: SortField<T>[]) => {
    setState(prev => ({
      ...prev,
      sorts,
      cursor: null, // Reset cursor when sorting
    }));
  }, []);

  const setFilters = useCallback((filters: FilterField[]) => {
    setState(prev => ({
      ...prev,
      filters,
      cursor: null, // Reset cursor when filtering
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      cursor: null,
      limit: defaultLimit,
      search: defaultSearch,
      sorts: defaultSorts,
      filters: defaultFilters,
      direction: 'next',
    });
    setHasNextPage(false);
    setNextCursor(null);
  }, [defaultLimit, defaultSearch, defaultSorts, defaultFilters]);

  const loadMore = useCallback(() => {
    if (hasNextPage && nextCursor) {
      setCursor(nextCursor);
    }
  }, [hasNextPage, nextCursor, setCursor]);

  // Update pagination info from API response
  const updatePaginationInfo = useCallback((paginationInfo: {
    hasNextPage: boolean;
    nextCursor: string | null;
  }) => {
    setHasNextPage(paginationInfo.hasNextPage);
    setNextCursor(paginationInfo.nextCursor);
  }, []);

  return {
    state,
    params,
    setCursor,
    setSearch,
    setSorts,
    setFilters,
    reset,
    loadMore,
    hasNextPage,
    nextCursor,
    updatePaginationInfo,
  };
}
