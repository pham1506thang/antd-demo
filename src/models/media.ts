import type {
  ImageSize,
  MediaFileType,
  MediaCategory,
  MEDIA_FILE_TYPES,
} from '@/constants/media';

export interface BaseMedia {
  id: string;
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
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface MediaSize {
  id: string;
  mediaId: string;
  sizeName: ImageSize;
  fileName: string;
  filePath: string;
  width: number;
  height: number;
  size: string;
  quality: number;
  createdAt: string;
}

export interface MediaTag {
  id: string;
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
