import { 
  useSearchMediaQuery,
  useFilterMediaQuery,
  useGetAllTagsQuery,
  useGetMediaByTagQuery,
  useGetFileUrlQuery,
} from '@/api/slices/mediaApi';

/**
 * Hook for cross-category media operations
 * Contains operations that work across both profile and general media
 */
export const useCrossMedia = () => {
  return {
    searchMedia: useSearchMediaQuery,
    filterMedia: useFilterMediaQuery,
    getAllTags: useGetAllTagsQuery,
    getMediaByTag: useGetMediaByTagQuery,
    getFileUrl: useGetFileUrlQuery,
  };
};
