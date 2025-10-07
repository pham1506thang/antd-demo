// Media Size Response DTO from API
export interface MediaSizeResponseDto {
  sizeName: string;
  fileName: string;
  filePath: string;
  width: number;
  height: number;
  size: number;
  quality?: number;
  url: string;
  createdAt: string; // ISO string from API
}

// Media Tag Response DTO from API
export interface MediaTagResponseDto {
  id: string;
  tagName: string;
  tagValue: string;
  createdBy: string;
  createdAt: string; // ISO string from API
}

// Core Media Response DTO from API (Updated structure)
export interface MediaResponseDto {
  id: string;
  originalName: string;
  fileName: string;
  mimeType: string;
  fileExtension: string;        // NEW FIELD
  fileType: 'image' | 'audio' | 'video';
  category: 'general' | 'profile';
  size: number;
  quality?: number;             // NEW FIELD
  uploaderId: string;
  isActive: boolean;
  isPublic: boolean;            // NEW FIELD
  altText?: string;             // NEW FIELD
  description?: string;         // NEW FIELD
  processingStatus: string;     // NEW FIELD
  metadata: {
    processingCompletedAt: string;
    generatedSizes: string[];
  };
  sizes: MediaSizeResponseDto[];   // NEW FIELD - Array of sizes
  tags: MediaTagResponseDto[];     // NEW FIELD - Array of tags
  createdAt: string; // ISO string from API
  updatedAt: string; // ISO string from API
}

// Extended Media interface for frontend use (Updated structure)
export interface Media {
  id: string;
  originalName: string;
  fileName: string;
  mimeType: string;
  fileExtension: string;        // NEW FIELD
  fileType: 'image' | 'audio' | 'video';
  category: 'general' | 'profile';
  size: number;
  quality?: number;             // NEW FIELD
  uploaderId: string;
  isActive: boolean;
  isPublic: boolean;            // NEW FIELD
  altText?: string;             // NEW FIELD
  description?: string;         // NEW FIELD
  processingStatus: string;     // NEW FIELD
  metadata: {
    processingCompletedAt: string;
    generatedSizes: string[];
  };
  sizes: MediaSizeResponseDto[];   // NEW FIELD - Array of sizes
  tags: MediaTagResponseDto[];     // NEW FIELD - Array of tags
  createdAt: Date; // Converted from string for frontend use
  updatedAt: Date; // Converted from string for frontend use
}

// Media List Query DTO
export interface MediaListQueryDto {
  search?: string;
  category?: 'general' | 'profile';
  fileType?: 'image' | 'audio' | 'video';
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
  tagName?: string;
  tagValue?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

// Update Media DTO (Updated for new fields)
export interface UpdateMediaDto {
  originalName?: string;
  altText?: string;             // NEW FIELD
  description?: string;         // NEW FIELD
  isPublic?: boolean;           // NEW FIELD
  isActive?: boolean;
  metadata?: Record<string, any>;
}

// Media Tag DTO
export interface MediaTagDto {
  id: string;
  mediaId: string;
  tagName: string;
  tagValue: string;
  createdBy: string;
  createdAt: string; // ISO string from API
}

// Media Processing Status DTO (Updated)
export interface MediaProcessingStatusDto {
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

// Processing Status enum for better type safety
export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';

// File URL Response
export interface FileUrlResponse {
  url: string;
}

// Tags Response
export interface TagsResponse {
  tags: string[];
}

// Media List Response
export interface MediaListResponse {
  data: MediaResponseDto[];
  total: number;
}

// Transformed Media List Response for frontend
export interface MediaListResponseTransformed {
  data: Media[];
  total: number;
}

// Media Sizes Response
export interface MediaSizesResponse {
  sizes: string[];
}

// Legacy interfaces removed - use MediaSizeResponseDto and MediaTagResponseDto

// Helper types for working with new media structure
export type MediaSizeName = 'thumbnail' | 'small' | 'medium' | 'large' | 'original';

// Helper function type for getting image URL from sizes array
export type GetImageUrlFunction = (media: Media, sizeName: MediaSizeName) => string | null;