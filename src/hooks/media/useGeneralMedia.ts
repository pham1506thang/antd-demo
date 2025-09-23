import { 
  useUploadGeneralImageMutation,
  useUploadMultipleGeneralImagesMutation,
  useListGeneralImagesQuery,
  useGetGeneralImageDetailsQuery,
  useGetGeneralImageSizesQuery,
  useUpdateGeneralImageMutation,
  useDeleteGeneralImageMutation,
  useSearchGeneralImagesQuery,
  useFilterGeneralImagesQuery,
  useGetGeneralImagesByTagQuery,
  useGetGeneralImageFileUrlQuery,
} from '@/api/slices/mediaApi';

/**
 * Hook for general media operations
 * Contains all general-specific media operations
 */
export const useGeneralMedia = () => {
  // Upload single general image
  const [uploadGeneralImage, uploadGeneralImageResult] = useUploadGeneralImageMutation();
  
  // Upload multiple general images
  const [uploadMultipleGeneralImages, uploadMultipleGeneralImagesResult] = useUploadMultipleGeneralImagesMutation();
  
  // Update general image
  const [updateGeneralImage, updateGeneralImageResult] = useUpdateGeneralImageMutation();
  
  // Delete general image
  const [deleteGeneralImage, deleteGeneralImageResult] = useDeleteGeneralImageMutation();

  return {
    // Mutations
    uploadGeneralImage,
    uploadGeneralImageResult,
    uploadMultipleGeneralImages,
    uploadMultipleGeneralImagesResult,
    updateGeneralImage,
    updateGeneralImageResult,
    deleteGeneralImage,
    deleteGeneralImageResult,
    
    // Query hooks
    listGeneralImages: useListGeneralImagesQuery,
    getGeneralImageDetails: useGetGeneralImageDetailsQuery,
    getGeneralImageSizes: useGetGeneralImageSizesQuery,
    searchGeneralImages: useSearchGeneralImagesQuery,
    filterGeneralImages: useFilterGeneralImagesQuery,
    getGeneralImagesByTag: useGetGeneralImagesByTagQuery,
    getGeneralImageFileUrl: useGetGeneralImageFileUrlQuery,
  };
};
