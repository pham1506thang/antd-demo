import type { MediaImage, MediaSize } from '@/models/media';
import { BASE_BACKEND_URL } from '@/constants';
import {
  IMAGE_SIZES,
  IMAGE_DIMENSIONS,
  PROFILE_IMAGE_DIMENSIONS,
  type ImageSize,
  MEDIA_CATEGORIES,
  type MediaCategory,
} from '@/constants/media';
import { DOMAINS } from '@/models/permission';


export const getAvailableImageSizes = (): ImageSize[] => {
  return Object.values(IMAGE_SIZES);
};

export const getImageDimensions = (
  size: ImageSize,
  category: 'general' | 'profile' = 'general'
): { width: number; height: number } | null => {
  if (category === 'profile') {
    return (
      PROFILE_IMAGE_DIMENSIONS[size as keyof typeof PROFILE_IMAGE_DIMENSIONS] ||
      null
    );
  }
  return IMAGE_DIMENSIONS[size as keyof typeof IMAGE_DIMENSIONS] || null;
};

export const getGeneralImageDimensions = (
  size: ImageSize
): { width: number; height: number } | null => {
  return getImageDimensions(size, MEDIA_CATEGORIES.GENERAL);
};

export const getProfileImageDimensions = (
  size: ImageSize
): { width: number; height: number } | null => {
  return getImageDimensions(size, MEDIA_CATEGORIES.PROFILE);
};

export const formatFileSize = (sizeStr: string): string => {
  const bytes = parseInt(sizeStr);
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

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

export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

export const isImageFile = (mimeType: string): boolean => {
  return mimeType.startsWith('image/');
};

export const isAudioFile = (mimeType: string): boolean => {
  return mimeType.startsWith('audio/');
};

export const isVideoFile = (mimeType: string): boolean => {
  return mimeType.startsWith('video/');
};

export const getMediaCategoryDisplayName = (
  category: MediaCategory
): string => {
  const categoryMap = {
    [MEDIA_CATEGORIES.GENERAL]: 'General Media',
    [MEDIA_CATEGORIES.PROFILE]: 'Profile Image',
  };

  return categoryMap[category];
};

export const getMediaDisplayName = (media: MediaImage): string => {
  return media.originalName || media.fileName || 'Unknown File';
};

export const hasMediaDimensions = (media: MediaImage): boolean => {
  if (!isImageFile(media.mimeType)) return false;

  // Check if media has sizes with dimensions
  return media.sizes && media.sizes.length > 0 && 
         media.sizes.some(size => size.width > 0 && size.height > 0);
};

export const getMediaAspectRatio = (media: MediaImage): number | null => {
  if (!hasMediaDimensions(media)) return null;

  // Get dimensions from the largest size
  const largestSize = media.sizes.reduce((prev, current) => 
    (current.width * current.height) > (prev.width * prev.height) ? current : prev
  );

  return largestSize.width / largestSize.height;
};

export const isMediaLandscape = (media: MediaImage): boolean => {
  const aspectRatio = getMediaAspectRatio(media);
  return aspectRatio !== null && aspectRatio > 1;
};

export const isMediaPortrait = (media: MediaImage): boolean => {
  const aspectRatio = getMediaAspectRatio(media);
  return aspectRatio !== null && aspectRatio < 1;
};

export const isMediaSquare = (media: MediaImage): boolean => {
  const aspectRatio = getMediaAspectRatio(media);
  return aspectRatio !== null && Math.abs(aspectRatio - 1) < 0.01;
};

export const getMediaMetadataSummary = (media: MediaImage): string => {
  const parts: string[] = [];

  // File type
  parts.push(formatFileType(media.mimeType));

  // File size
  parts.push(formatFileSize(media.size));

  // Dimensions (for images) - get from largest size
  if (hasMediaDimensions(media)) {
    const largestSize = media.sizes.reduce((prev, current) => 
      (current.width * current.height) > (prev.width * prev.height) ? current : prev
    );
    parts.push(`${largestSize.width}×${largestSize.height}px`);
  }

  // Category
  parts.push(getMediaCategoryDisplayName(media.category));

  return parts.join(' • ');
};

export const validateFileForUpload = (
  file: File,
  category: MediaCategory,
  maxSize?: number
): { isValid: boolean; error?: string } => {
  // Check file size
  if (maxSize && file.size > maxSize) {
    return {
      isValid: false,
      error: `File size exceeds maximum allowed size of ${formatFileSize(maxSize.toString())}`,
    };
  }

  // Check file type based on category
  if (category === MEDIA_CATEGORIES.PROFILE && !isImageFile(file.type)) {
    return {
      isValid: false,
      error: 'Only image files are allowed for profile uploads',
    };
  }

  return { isValid: true };
};

export const getMediaTags = (media: MediaImage): string[] => {
  const tags: string[] = [];

  // Add category tag
  tags.push(media.category);

  // Add file type tag
  tags.push(media.fileType);

  // Note: tags array is no longer available in new structure
  // Only basic category and file type tags are available

  return [...new Set(tags)]; // Remove duplicates
};

export const getImageUrl = (
  sizes: MediaSize[],
  imageSize: ImageSize
): string | null => {
  const size = sizes.find((s) => s.sizeName === imageSize);
  return size ? `${BASE_BACKEND_URL}/${DOMAINS.MEDIAS.value}/${size.filePath}/${size.fileName}` : null;
};

export const getThumbnailUrl = (sizes: MediaSize[]): string | null => {
  return getImageUrl(sizes, IMAGE_SIZES.THUMBNAIL);
};

export const getDisplayUrl = (sizes: MediaSize[]): string | null => {
  return (
    getImageUrl(sizes, IMAGE_SIZES.LARGE) ||
    getImageUrl(sizes, IMAGE_SIZES.ORIGINAL) ||
    getImageUrl(sizes, sizes[0]?.sizeName) ||
    null
  );
};

export const getBestSizeUrl = (
  sizes: MediaSize[],
  preferredSize: ImageSize = IMAGE_SIZES.MEDIUM
): string | null => {
  // Try preferred size first
  let url = getImageUrl(sizes, preferredSize);
  if (url) return url;

  // Fallback order: medium -> large -> small -> original -> thumbnail
  const fallbackOrder = [
    IMAGE_SIZES.MEDIUM,
    IMAGE_SIZES.LARGE,
    IMAGE_SIZES.SMALL,
    IMAGE_SIZES.ORIGINAL,
    IMAGE_SIZES.THUMBNAIL,
  ];
  for (const size of fallbackOrder) {
    url = getImageUrl(sizes, size);
    if (url) return url;
  }

  return null;
};

export const getAvailableSizes = (sizes: MediaSize[]): ImageSize[] => {
  return sizes.map((s) => s.sizeName);
};

export const hasSize = (sizes: MediaSize[], sizeName: ImageSize): boolean => {
  return sizes.some((s) => s.sizeName === sizeName);
};

export const getSizeDimensions = (
  sizes: MediaSize[],
  sizeName: ImageSize
): { width: number; height: number } | null => {
  const size = sizes.find((s) => s.sizeName === sizeName);
  return size ? { width: size.width, height: size.height } : null;
};
