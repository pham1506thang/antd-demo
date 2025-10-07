import { useCallback } from 'react';
import type { Media, MediaResponseDto } from '@/models/media';
import { convertApiMediaToMedia } from '@/helpers/media';
import { mediaUtils } from '@/api/slices/mediaApi';

/**
 * Hook for media utilities and helpers
 * Simplified - only essential functions
 */
export const useMediaUtils = () => {
  // Convert API response to Media
  const convertToMedia = useCallback((apiMedia: MediaResponseDto): Media => {
    return convertApiMediaToMedia(apiMedia);
  }, []);

  // Direct access to mediaUtils from API
  return {
    convertToMedia,
    ...mediaUtils, // Spread all mediaUtils functions
  };
};
