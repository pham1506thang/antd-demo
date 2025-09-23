import { useCallback } from 'react';
import type { Media } from '@/models/media';
import { 
  generateMediaFileUrl, 
  generateMediaThumbnailUrl, 
  generateMediaDisplayUrl,
  convertApiMediaToMedia 
} from '@/helpers/media';
import { MEDIA_IMAGE_SIZES } from '@/constants/media';

/**
 * Hook for media utilities and helpers
 * Contains only common utilities that can be used across different media types
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
