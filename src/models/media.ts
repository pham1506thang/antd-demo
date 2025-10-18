import type {
  ImageSize,
  MediaFileType,
  MediaCategory,
  MEDIA_FILE_TYPES,
} from '@/constants/media';
import type { BaseModel } from './base';

export interface BaseMedia extends BaseModel {
  originalName: string;
  fileName: string;
  mimeType: string;
  fileExtension: string;
  fileType: MediaFileType;
  category: MediaCategory;
  size: string;
  uploaderId: string;
  isActive: boolean;
  isPublic: boolean;
  altText: string | null;
  description: string | null;
  processingStatus: string;
  metadata: Record<string, any>;
}

export interface MediaSize extends BaseModel {
  mediaId: string;
  sizeName: ImageSize;
  fileName: string;
  filePath: string;
  width: number;
  height: number;
  size: string;
  quality: number;
}

export interface MediaTag extends BaseModel {
  name: string;
  value?: string;
}

export interface MediaImage extends BaseMedia {
  fileType: typeof MEDIA_FILE_TYPES.IMAGE;
  metadata: {
    generatedSizes: string[];
    processingCompletedAt: string;
  };
  sizes: MediaSize[];
  tags: MediaTag[];
}
