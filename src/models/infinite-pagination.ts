import type { SortField, FilterField } from './pagination';

// Generic infinite pagination result
export interface InfinitePaginationResult<T> {
  data: T[];
  pagination: {
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextCursor: string | null;
    prevCursor: string | null;
    limit: number;
  };
}

// Infinite Scroll Parameters DTO
export interface InfiniteParamsDto<T> {
  limit?: number;
  cursor?: string;
  search?: string;
  filters?: FilterField[];
  sorts?: SortField<T>[];
  direction?: 'next' | 'prev';
}
