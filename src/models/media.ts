// Core Media Response DTO from API
export interface MediaResponseDto {
  id: string;
  originalName: string;
  fileName: string;
  mimeType: string;
  fileType: 'image' | 'audio' | 'video';
  category: 'general' | 'profile';
  size: number;
  width?: number;
  height?: number;
  uploaderId: string;
  isActive: boolean;
  metadata: Record<string, any>;
  createdAt: string; // ISO string from API
  updatedAt: string; // ISO string from API
}

// Extended Media interface for frontend use
export interface Media {
  id: string;
  originalName: string;
  fileName: string;
  mimeType: string;
  fileType: 'image' | 'audio' | 'video';
  category: 'general' | 'profile';
  size: number;
  width?: number;
  height?: number;
  uploaderId: string;
  isActive: boolean;
  metadata: Record<string, any>;
  createdAt: Date; // Converted from string for frontend use
  updatedAt: Date; // Converted from string for frontend use
  url?: string; // For display - generated from file URL
  thumbnailUrl?: string; // For grid display - generated from thumbnail size
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

// Update Media DTO
export interface UpdateMediaDto {
  originalName?: string;
  metadata?: Record<string, any>;
  isActive?: boolean;
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

// Media Processing Status DTO
export interface MediaProcessingStatusDto {
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

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

// Legacy interfaces for backward compatibility
export interface MediaSize {
  id: string;
  mediaId: string;
  sizeName: string;
  fileName: string;
  filePath: string;
  width: number;
  height: number;
  size: number;
  quality: number;
  createdAt: Date;
}

export interface MediaTag {
  id: string;
  mediaId: string;
  tagName: string;
  tagValue: string;
  createdAt: Date;
  createdBy: string;
}