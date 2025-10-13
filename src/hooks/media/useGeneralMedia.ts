import { useState, useCallback } from 'react';
import { 
  useUploadGeneralImageMutation,
  useUploadMultipleGeneralImagesMutation,
  useListGeneralImagesQuery,
  useUpdateGeneralImageMutation,
  useDeleteGeneralImageMutation,
} from '@/api/slices/mediaApi';
import type { MediaImage } from '@/models/media';

export interface UseGeneralMediaInfiniteOptions {
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  limit?: number;
}

export interface UseGeneralMediaInfiniteReturn {
  images: MediaImage[];
  hasNextPage: boolean;
  nextCursor: string | null;
  loading: boolean;
  loadingMore: boolean;
  uploading: boolean;
  loadMore: () => void;
  refresh: () => void;
  search: (query: string) => void;
  sort: (sortBy: string, sortOrder: 'ASC' | 'DESC') => void;
  uploadGeneralImage: (params: any) => Promise<any>;
  uploadMultipleGeneralImages: (params: any) => Promise<any>;
  updateGeneralImage: (params: any) => Promise<any>;
  deleteGeneralImage: (params: any) => Promise<any>;
}

export const useGeneralMedia = () => {
  const [uploadGeneralImage, uploadGeneralImageResult] = useUploadGeneralImageMutation();
  
  const [uploadMultipleGeneralImages, uploadMultipleGeneralImagesResult] = useUploadMultipleGeneralImagesMutation();
  
  const [updateGeneralImage, updateGeneralImageResult] = useUpdateGeneralImageMutation();
  
  const [deleteGeneralImage, deleteGeneralImageResult] = useDeleteGeneralImageMutation();

  return {
    uploadGeneralImage,
    uploadGeneralImageResult,
    uploadMultipleGeneralImages,
    uploadMultipleGeneralImagesResult,
    updateGeneralImage,
    updateGeneralImageResult,
    deleteGeneralImage,
    deleteGeneralImageResult,
    
    listGeneralImages: useListGeneralImagesQuery,
  };
};

/**
 * Hook for infinite scroll general media using RTK Query merge strategy
 */
export const useGeneralMediaInfinite = (
  options: UseGeneralMediaInfiniteOptions = {}
): UseGeneralMediaInfiniteReturn => {
  const {
    search: initialSearch = '',
    sortBy: initialSortBy = 'createdAt',
    sortOrder: initialSortOrder = 'DESC',
    limit = 20,
  } = options;

  // State for pagination
  const [cursor, setCursor] = useState<string | null>(null);
  const [search, setSearch] = useState(initialSearch);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortOrder, setSortOrder] = useState(initialSortOrder);

  // Upload mutations
  const [uploadGeneralImage, uploadGeneralImageResult] = useUploadGeneralImageMutation();
  const [uploadMultipleGeneralImages, uploadMultipleGeneralImagesResult] = useUploadMultipleGeneralImagesMutation();
  const [updateGeneralImage] = useUpdateGeneralImageMutation();
  const [deleteGeneralImage] = useDeleteGeneralImageMutation();

  // RTK Query with automatic data merging
  const { data, isLoading, refetch } = useListGeneralImagesQuery({
    cursor: cursor || undefined,
    limit,
    search: search || undefined,
    sorts: [{ field: sortBy as keyof MediaImage, order: sortOrder === 'ASC' ? 'ascend' : 'descend' }],
  });

  // Actions
  const loadMore = useCallback(() => {
    if (data?.pagination.hasNextPage && data.pagination.nextCursor) {
      setCursor(data.pagination.nextCursor);
    }
  }, [data?.pagination]);

  const refresh = useCallback(() => {
    setCursor(null);
    refetch();
  }, [refetch]);

  const searchImages = useCallback((query: string) => {
    setSearch(query);
    setCursor(null); // Reset cursor when searching
  }, []);

  const sortImages = useCallback((newSortBy: string, newSortOrder: 'ASC' | 'DESC') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setCursor(null); // Reset cursor when sorting
  }, []);

  return {
    // Data - RTK Query automatically merges accumulated data
    images: data?.data || [],
    hasNextPage: data?.pagination.hasNextPage || false,
    nextCursor: data?.pagination.nextCursor || null,
    
    // Loading states
    loading: isLoading && !cursor, // Initial load
    loadingMore: isLoading && !!cursor, // Load more
    uploading: uploadGeneralImageResult.isLoading || uploadMultipleGeneralImagesResult.isLoading,
    
    // Actions
    loadMore,
    refresh,
    search: searchImages,
    sort: sortImages,
    
    // Upload actions
    uploadGeneralImage,
    uploadMultipleGeneralImages,
    updateGeneralImage,
    deleteGeneralImage,
  };
};
