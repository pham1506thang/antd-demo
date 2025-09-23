import { 
  useUploadProfileImageMutation,
  useUploadMultipleProfileImagesMutation,
  useListProfileImagesQuery,
  useGetProfileImageDetailsQuery,
  useGetProfileImageSizesQuery,
  useUpdateProfileImageMutation,
  useDeleteProfileImageMutation,
  useSearchProfileImagesQuery,
  useFilterProfileImagesQuery,
  useGetProfileImagesByTagQuery,
  useGetProfileImageFileUrlQuery,
} from '@/api/slices/mediaApi';

/**
 * Hook for profile media operations
 * Contains all profile-specific media operations
 */
export const useProfileMedia = () => {
  // Upload single profile image
  const [uploadProfileImage, uploadProfileImageResult] = useUploadProfileImageMutation();
  
  // Upload multiple profile images
  const [uploadMultipleProfileImages, uploadMultipleProfileImagesResult] = useUploadMultipleProfileImagesMutation();
  
  // Update profile image
  const [updateProfileImage, updateProfileImageResult] = useUpdateProfileImageMutation();
  
  // Delete profile image
  const [deleteProfileImage, deleteProfileImageResult] = useDeleteProfileImageMutation();

  return {
    // Mutations
    uploadProfileImage,
    uploadProfileImageResult,
    uploadMultipleProfileImages,
    uploadMultipleProfileImagesResult,
    updateProfileImage,
    updateProfileImageResult,
    deleteProfileImage,
    deleteProfileImageResult,
    
    // Query hooks
    listProfileImages: useListProfileImagesQuery,
    getProfileImageDetails: useGetProfileImageDetailsQuery,
    getProfileImageSizes: useGetProfileImageSizesQuery,
    searchProfileImages: useSearchProfileImagesQuery,
    filterProfileImages: useFilterProfileImagesQuery,
    getProfileImagesByTag: useGetProfileImagesByTagQuery,
    getProfileImageFileUrl: useGetProfileImageFileUrlQuery,
  };
};
