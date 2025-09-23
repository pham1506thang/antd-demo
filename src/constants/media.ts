// Media file types
export const MEDIA_FILE_TYPES = {
  IMAGE: 'image',
  AUDIO: 'audio',
  VIDEO: 'video',
} as const;

// Media categories
export const MEDIA_CATEGORIES = {
  GENERAL: 'general',
  PROFILE: 'profile',
} as const;

// General image sizes (3:2 aspect ratio - landscape)
export const IMAGE_SIZES = {
  THUMBNAIL: 'thumbnail',
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  ORIGINAL: 'original',
} as const;

// General image size dimensions (3:2 aspect ratio)
export const IMAGE_DIMENSIONS = {
  [IMAGE_SIZES.THUMBNAIL]: { width: 150, height: 100 },
  [IMAGE_SIZES.SMALL]: { width: 300, height: 200 },
  [IMAGE_SIZES.MEDIUM]: { width: 600, height: 400 },
  [IMAGE_SIZES.LARGE]: { width: 1200, height: 800 },
} as const;

// Profile image sizes (1:1 aspect ratio - square)
export const PROFILE_IMAGE_SIZES = {
  THUMBNAIL: 'thumbnail',
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  ORIGINAL: 'original',
} as const;

// Profile image size dimensions (1:1 aspect ratio)
export const PROFILE_IMAGE_DIMENSIONS = {
  [PROFILE_IMAGE_SIZES.THUMBNAIL]: { width: 150, height: 150 },
  [PROFILE_IMAGE_SIZES.SMALL]: { width: 300, height: 300 },
  [PROFILE_IMAGE_SIZES.MEDIUM]: { width: 600, height: 600 },
  [PROFILE_IMAGE_SIZES.LARGE]: { width: 1200, height: 1200 },
} as const;

// Legacy constants for backward compatibility
export const MEDIA_IMAGE_SIZES = IMAGE_SIZES;
export const MEDIA_IMAGE_DIMENSIONS = IMAGE_DIMENSIONS;

// Supported image MIME types
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
] as const;

// Supported audio MIME types
export const SUPPORTED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/ogg',
  'audio/m4a',
] as const;

// Supported video MIME types
export const SUPPORTED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/avi',
  'video/mov',
] as const;

// All supported MIME types
export const SUPPORTED_MIME_TYPES = [
  ...SUPPORTED_IMAGE_TYPES,
  ...SUPPORTED_AUDIO_TYPES,
  ...SUPPORTED_VIDEO_TYPES,
] as const;

// File size limits (in bytes)
export const FILE_SIZE_LIMITS = {
  IMAGE: 10 * 1024 * 1024, // 10MB
  AUDIO: 50 * 1024 * 1024, // 50MB
  VIDEO: 100 * 1024 * 1024, // 100MB
} as const;

// Default pagination
export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// Sort options
export const MEDIA_SORT_OPTIONS = {
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
  ORIGINAL_NAME: 'originalName',
  FILE_SIZE: 'size',
  UPLOADER_ID: 'uploaderId',
} as const;

// Sort order
export const SORT_ORDER = {
  ASC: 'ASC',
  DESC: 'DESC',
} as const;

// Media processing status
export const MEDIA_PROCESSING_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

