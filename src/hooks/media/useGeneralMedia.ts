import React, { useState, useCallback, useMemo } from 'react';
import { 
  useUploadGeneralImageMutation,
  useUploadMultipleGeneralImagesMutation,
  useListGeneralImagesQuery,
  useUpdateGeneralImageMutation,
  useDeleteGeneralImageMutation,
} from '@/api/slices/mediaApi';
import type { MediaImage } from '@/models/media';
import { useInfinitePagination } from '@/hooks/useInfinitePagination';

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

export const useGeneralMediaInfinite = (
  options: UseGeneralMediaInfiniteOptions = {}
): UseGeneralMediaInfiniteReturn => {
  const {
    search: initialSearch = '',
    sortBy: initialSortBy = 'createdAt',
    sortOrder: initialSortOrder = 'DESC',
    limit = 20,
  } = options;

  const [uploadGeneralImage, uploadGeneralImageResult] = useUploadGeneralImageMutation();
  const [uploadMultipleGeneralImages, uploadMultipleGeneralImagesResult] = useUploadMultipleGeneralImagesMutation();
  const [updateGeneralImage] = useUpdateGeneralImageMutation();
  const [deleteGeneralImage] = useDeleteGeneralImageMutation();

  // Infinite pagination hook
  const {
    params,
    setSearch,
    setSorts,
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
  const { data, isLoading, refetch } = useListGeneralImagesQuery(params);

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
        const existingIds = new Set(prev.map(img => img.id));
        const uniqueNewImages = newImages.filter(img => !existingIds.has(img.id));
        return [...prev, ...uniqueNewImages];
      } else {
        return newImages;
      }
    });
  }, []);

  // Refresh function
  const refresh = useCallback(() => {
    setAllImages([]);
    reset();
    setIsInitialLoad(true);
    refetch();
  }, [reset, refetch]);

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
    images: allImages,
    hasNextPage,
    nextCursor,
    loading: isLoading && isInitialLoad,
    loadingMore: isLoading && !isInitialLoad,
    uploading: uploadGeneralImageResult.isLoading || uploadMultipleGeneralImagesResult.isLoading,
    loadMore,
    refresh,
    search: setSearch,
    sort,
    uploadGeneralImage: uploadGeneralImage,
    uploadMultipleGeneralImages: uploadMultipleGeneralImages,
    updateGeneralImage: updateGeneralImage,
    deleteGeneralImage: deleteGeneralImage,
  };
};
