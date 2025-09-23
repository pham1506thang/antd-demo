import { useCallback } from 'react';
import { 
  useSearchMediaQuery,
  useFilterMediaQuery,
  useGetAllTagsQuery,
  useGetMediaByTagQuery,
  useGetFileUrlQuery,
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
import type { 
  Media
} from '@/models/media';
import { 
  generateMediaFileUrl, 
  generateMediaThumbnailUrl, 
  generateMediaDisplayUrl,
  convertApiMediaToMedia 
} from '@/helpers/media';
import { MEDIA_IMAGE_SIZES } from '@/constants/media';

/**
 * Hook for cross-category media operations
 */
export const useMedia = () => {
  return {
    searchMedia: useSearchMediaQuery,
    filterMedia: useFilterMediaQuery,
    getAllTags: useGetAllTagsQuery,
    getMediaByTag: useGetMediaByTagQuery,
    getFileUrl: useGetFileUrlQuery,
  };
};

/**
 * Hook for profile media operations
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

/**
 * Hook for general media operations
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

/**
 * Hook for media utilities and helpers
 */
export const useMediaUtils = () => {
  // Generate file URL
  const generateFileUrl = useCallback((
    mediaId: string, 
    category: 'general' | 'profile', 
    size: string = MEDIA_IMAGE_SIZES.ORIGINAL
  ) => {
    return generateMediaFileUrl(mediaId, category, size);
  }, []);

  // Generate thumbnail URL
  const generateThumbnailUrl = useCallback((
    mediaId: string, 
    category: 'general' | 'profile'
  ) => {
    return generateMediaThumbnailUrl(mediaId, category);
  }, []);

  // Generate display URL
  const generateDisplayUrl = useCallback((
    mediaId: string, 
    category: 'general' | 'profile',
    size: string = MEDIA_IMAGE_SIZES.MEDIUM
  ) => {
    return generateMediaDisplayUrl(mediaId, category, size);
  }, []);

  // Convert API response to Media
  const convertToMedia = useCallback((apiMedia: any): Media => {
    return convertApiMediaToMedia(apiMedia);
  }, []);

  return {
    generateFileUrl,
    generateThumbnailUrl,
    generateDisplayUrl,
    convertToMedia,
  };
};

/**
 * Hook for media with enhanced functionality
 */
export const useMediaWithUtils = () => {
  const media = useMedia();
  const profileMedia = useProfileMedia();
  const generalMedia = useGeneralMedia();
  const mediaUtils = useMediaUtils();

  return {
    ...media,
    profile: profileMedia,
    general: generalMedia,
    utils: mediaUtils,
  };
};