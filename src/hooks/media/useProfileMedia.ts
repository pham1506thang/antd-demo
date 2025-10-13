import { useState, useCallback } from 'react';
import { 
  useUploadProfileImageMutation,
  useUploadMultipleProfileImagesMutation,
  useListProfileImagesQuery,
  useUpdateProfileImageMutation,
  useDeleteProfileImageMutation,
} from '@/api/slices/mediaApi';
import type { MediaImage } from '@/models/media';

export interface UseProfileMediaInfiniteOptions {
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  limit?: number;
}

export interface UseProfileMediaInfiniteReturn {
  // Data
  images: MediaImage[];
  hasNextPage: boolean;
  nextCursor: string | null;
  
  // Loading states
  loading: boolean;
  loadingMore: boolean;
  uploading: boolean;
  
  // Actions
  loadMore: () => void;
  refresh: () => void;
  search: (query: string) => void;
  sort: (sortBy: string, sortOrder: 'ASC' | 'DESC') => void;
  
  // Upload actions
  uploadProfileImage: (params: any) => Promise<any>;
  uploadMultipleProfileImages: (params: any) => Promise<any>;
  updateProfileImage: (params: any) => Promise<any>;
  deleteProfileImage: (params: any) => Promise<any>;
}

export const useProfileMedia = () => {
  const [uploadProfileImage, uploadProfileImageResult] = useUploadProfileImageMutation();
  
  const [uploadMultipleProfileImages, uploadMultipleProfileImagesResult] = useUploadMultipleProfileImagesMutation();
  
  const [updateProfileImage, updateProfileImageResult] = useUpdateProfileImageMutation();
  
  const [deleteProfileImage, deleteProfileImageResult] = useDeleteProfileImageMutation();

  return {
    uploadProfileImage,
    uploadProfileImageResult,
    uploadMultipleProfileImages,
    uploadMultipleProfileImagesResult,
    updateProfileImage,
    updateProfileImageResult,
    deleteProfileImage,
    deleteProfileImageResult,
    
    listProfileImages: useListProfileImagesQuery,
  };
};

/**
 * Hook for infinite scroll profile media using RTK Query merge strategy
 */
export const useProfileMediaInfinite = (
  options: UseProfileMediaInfiniteOptions = {}
): UseProfileMediaInfiniteReturn => {
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
  const [uploadProfileImage, uploadProfileImageResult] = useUploadProfileImageMutation();
  const [uploadMultipleProfileImages, uploadMultipleProfileImagesResult] = useUploadMultipleProfileImagesMutation();
  const [updateProfileImage] = useUpdateProfileImageMutation();
  const [deleteProfileImage] = useDeleteProfileImageMutation();

  // RTK Query with automatic data merging
  const { data, isLoading, refetch } = useListProfileImagesQuery({
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
    uploading: uploadProfileImageResult.isLoading || uploadMultipleProfileImagesResult.isLoading,
    
    // Actions
    loadMore,
    refresh,
    search: searchImages,
    sort: sortImages,
    
    // Upload actions
    uploadProfileImage,
    uploadMultipleProfileImages,
    updateProfileImage,
    deleteProfileImage,
  };
};
