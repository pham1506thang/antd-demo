import type { Media, MediaResponseDto } from '@/models/media';
import { 
  IMAGE_SIZES, 
  IMAGE_DIMENSIONS, 
  PROFILE_IMAGE_SIZES, 
  PROFILE_IMAGE_DIMENSIONS,
  MEDIA_IMAGE_SIZES
} from '@/constants/media';

/**
 * Convert API response to frontend Media interface
 */
export const convertApiMediaToMedia = (apiMedia: MediaResponseDto): Media => ({
  ...apiMedia,
  createdAt: new Date(apiMedia.createdAt),
  updatedAt: new Date(apiMedia.updatedAt),
  url: undefined, // Will be generated when needed
  thumbnailUrl: undefined, // Will be generated when needed
});

/**
 * Generate file URL for media
 */
export const generateMediaFileUrl = (
  mediaId: string, 
  category: 'general' | 'profile', 
  size: string = MEDIA_IMAGE_SIZES.ORIGINAL
): string => {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  return `${baseUrl}/medias/${category}/${mediaId}/file/${size}`;
};

/**
 * Generate thumbnail URL for media
 */
export const generateMediaThumbnailUrl = (
  mediaId: string, 
  category: 'general' | 'profile'
): string => {
  return generateMediaFileUrl(mediaId, category, MEDIA_IMAGE_SIZES.THUMBNAIL);
};

/**
 * Generate display URL for media
 */
export const generateMediaDisplayUrl = (
  mediaId: string, 
  category: 'general' | 'profile',
  size: string = MEDIA_IMAGE_SIZES.MEDIUM
): string => {
  return generateMediaFileUrl(mediaId, category, size);
};

/**
 * Get available image sizes for general media
 */
export const getAvailableImageSizes = (): string[] => {
  return Object.values(IMAGE_SIZES);
};

/**
 * Get available image sizes for profile media
 */
export const getAvailableProfileImageSizes = (): string[] => {
  return Object.values(PROFILE_IMAGE_SIZES);
};

/**
 * Get image dimensions for a specific size and category
 */
export const getImageDimensions = (
  size: string, 
  category: 'general' | 'profile' = 'general'
): { width: number; height: number } | null => {
  if (category === 'profile') {
    return PROFILE_IMAGE_DIMENSIONS[size as keyof typeof PROFILE_IMAGE_DIMENSIONS] || null;
  }
  return IMAGE_DIMENSIONS[size as keyof typeof IMAGE_DIMENSIONS] || null;
};

/**
 * Get image dimensions for general media (legacy function)
 */
export const getGeneralImageDimensions = (size: string): { width: number; height: number } | null => {
  return getImageDimensions(size, 'general');
};

/**
 * Get image dimensions for profile media
 */
export const getProfileImageDimensions = (size: string): { width: number; height: number } | null => {
  return getImageDimensions(size, 'profile');
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format file type for display
 */
export const formatFileType = (mimeType: string): string => {
  const typeMap: Record<string, string> = {
    'image/jpeg': 'JPEG Image',
    'image/jpg': 'JPEG Image',
    'image/png': 'PNG Image',
    'image/webp': 'WebP Image',
    'image/gif': 'GIF Image',
    'audio/mpeg': 'MP3 Audio',
    'audio/mp3': 'MP3 Audio',
    'audio/wav': 'WAV Audio',
    'audio/ogg': 'OGG Audio',
    'audio/m4a': 'M4A Audio',
    'video/mp4': 'MP4 Video',
    'video/webm': 'WebM Video',
    'video/ogg': 'OGG Video',
    'video/avi': 'AVI Video',
    'video/mov': 'MOV Video',
  };
  
  return typeMap[mimeType] || mimeType;
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

/**
 * Check if file is an image
 */
export const isImageFile = (mimeType: string): boolean => {
  return mimeType.startsWith('image/');
};

/**
 * Check if file is an audio
 */
export const isAudioFile = (mimeType: string): boolean => {
  return mimeType.startsWith('audio/');
};

/**
 * Check if file is a video
 */
export const isVideoFile = (mimeType: string): boolean => {
  return mimeType.startsWith('video/');
};

/**
 * Get media category display name
 */
export const getMediaCategoryDisplayName = (category: 'general' | 'profile'): string => {
  const categoryMap = {
    general: 'General Media',
    profile: 'Profile Image',
  };
  
  return categoryMap[category];
};

/**
 * Generate media display name
 */
export const getMediaDisplayName = (media: Media): string => {
  return media.originalName || media.fileName || 'Unknown File';
};

/**
 * Check if media has dimensions (is an image)
 */
export const hasMediaDimensions = (media: Media): boolean => {
  return isImageFile(media.mimeType) && 
         typeof media.width === 'number' && 
         typeof media.height === 'number';
};

/**
 * Get media aspect ratio
 */
export const getMediaAspectRatio = (media: Media): number | null => {
  if (!hasMediaDimensions(media)) return null;
  
  return (media.width! / media.height!);
};

/**
 * Check if media is landscape
 */
export const isMediaLandscape = (media: Media): boolean => {
  const aspectRatio = getMediaAspectRatio(media);
  return aspectRatio !== null && aspectRatio > 1;
};

/**
 * Check if media is portrait
 */
export const isMediaPortrait = (media: Media): boolean => {
  const aspectRatio = getMediaAspectRatio(media);
  return aspectRatio !== null && aspectRatio < 1;
};

/**
 * Check if media is square
 */
export const isMediaSquare = (media: Media): boolean => {
  const aspectRatio = getMediaAspectRatio(media);
  return aspectRatio !== null && Math.abs(aspectRatio - 1) < 0.01;
};

/**
 * Generate media metadata summary
 */
export const getMediaMetadataSummary = (media: Media): string => {
  const parts: string[] = [];
  
  // File type
  parts.push(formatFileType(media.mimeType));
  
  // File size
  parts.push(formatFileSize(media.size));
  
  // Dimensions (for images)
  if (hasMediaDimensions(media)) {
    parts.push(`${media.width}×${media.height}px`);
  }
  
  // Category
  parts.push(getMediaCategoryDisplayName(media.category));
  
  return parts.join(' • ');
};

/**
 * Validate file before upload
 */
export const validateFileForUpload = (
  file: File, 
  category: 'general' | 'profile',
  maxSize?: number
): { isValid: boolean; error?: string } => {
  // Check file size
  if (maxSize && file.size > maxSize) {
    return {
      isValid: false,
      error: `File size exceeds maximum allowed size of ${formatFileSize(maxSize)}`
    };
  }
  
  // Check file type based on category
  if (category === 'profile' && !isImageFile(file.type)) {
    return {
      isValid: false,
      error: 'Only image files are allowed for profile uploads'
    };
  }
  
  return { isValid: true };
};

/**
 * Generate media tags for display
 */
export const getMediaTags = (media: Media): string[] => {
  const tags: string[] = [];
  
  // Add category tag
  tags.push(media.category);
  
  // Add file type tag
  tags.push(media.fileType);
  
  // Add metadata tags if available
  if (media.metadata?.tags && Array.isArray(media.metadata.tags)) {
    tags.push(...media.metadata.tags);
  }
  
  return [...new Set(tags)]; // Remove duplicates
};
