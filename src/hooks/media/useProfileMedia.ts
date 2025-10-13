import React, { useState, useCallback, useMemo } from 'react';
import { 
  useUploadProfileImageMutation,
  useUploadMultipleProfileImagesMutation,
  useListProfileImagesQuery,
  useUpdateProfileImageMutation,
  useDeleteProfileImageMutation,
} from '@/api/slices/mediaApi';
import type { MediaImage } from '@/models/media';
import { useInfinitePagination } from '@/hooks/useInfinitePagination';

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
 * Hook for infinite scroll profile media with data accumulation
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

  // Upload mutations
  const [uploadProfileImage, uploadProfileImageResult] = useUploadProfileImageMutation();
  const [uploadMultipleProfileImages, uploadMultipleProfileImagesResult] = useUploadMultipleProfileImagesMutation();
  const [updateProfileImage] = useUpdateProfileImageMutation();
  const [deleteProfileImage] = useDeleteProfileImageMutation();

  // Infinite pagination hook
  const {
    params,
    setSearch,
    setSorts,
    setCursor,
    reset,
    loadMore,
    hasNextPage,
    nextCursor,
    updatePaginationInfo,
  } = useInfinitePagination<MediaImage>({
    defaultLimit: limit,
    defaultSearch: initialSearch,
    defaultSorts: [{ field: initialSortBy as keyof MediaImage, order: initialSortOrder === 'ASC' ? 'ascend' : 'descend' }],
  });

  // State management
  const [allImages, setAllImages] = useState<MediaImage[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // API query
  const { data, isLoading, refetch } = useListProfileImagesQuery(params);

  // Process data
  const processedData = useMemo(() => {
    if (!data?.data) return { images: [], hasNextPage: false, nextCursor: null };
    
    const images = data.data;
    const hasNextPage = data.pagination.hasNextPage;
    const nextCursor = data.pagination.nextCursor;

    return { images, hasNextPage, nextCursor };
  }, [data]);

  // Update accumulated images
  const updateAccumulatedImages = useCallback((newImages: MediaImage[], isAppend: boolean = true) => {
    setAllImages(prev => {
      if (isAppend && prev.length > 0) {
        // Append new images, avoiding duplicates
        const existingIds = new Set(prev.map(img => img.id));
        const uniqueNewImages = newImages.filter(img => !existingIds.has(img.id));
        return [...prev, ...uniqueNewImages];
      } else {
        // Replace all images (for search, sort, or refresh)
        return newImages;
      }
    });
  }, []);

  // Refresh function
  const refresh = useCallback(() => {
    setAllImages([]);
    setCursor(null);
    setIsInitialLoad(true);
    refetch();
  }, [setCursor, refetch]);

  // Sort function
  const sort = useCallback((newSortBy: string, newSortOrder: 'ASC' | 'DESC') => {
    setSorts([{ field: newSortBy as keyof MediaImage, order: newSortOrder === 'ASC' ? 'ascend' : 'descend' }]);
    setAllImages([]);
    setIsInitialLoad(true);
  }, [setSorts]);

  // Update accumulated images when data changes
  React.useEffect(() => {
    if (processedData.images.length > 0) {
      updateAccumulatedImages(processedData.images, !isInitialLoad);
      setIsInitialLoad(false);
    }
  }, [processedData.images, updateAccumulatedImages, isInitialLoad]);

  // Update pagination info
  React.useEffect(() => {
    updatePaginationInfo({
      hasNextPage: processedData.hasNextPage,
      nextCursor: processedData.nextCursor,
    });
  }, [processedData.hasNextPage, processedData.nextCursor, updatePaginationInfo]);

  return {
    // Data
    images: allImages,
    hasNextPage,
    nextCursor,
    
    // Loading states
    loading: isLoading && isInitialLoad,
    loadingMore: isLoading && !isInitialLoad,
    uploading: uploadProfileImageResult.isLoading || uploadMultipleProfileImagesResult.isLoading,
    
    // Actions
    loadMore,
    refresh,
    search: setSearch,
    sort,
    
    // Upload actions
    uploadProfileImage: uploadProfileImage,
    uploadMultipleProfileImages: uploadMultipleProfileImages,
    updateProfileImage: updateProfileImage,
    deleteProfileImage: deleteProfileImage,
  };
};
