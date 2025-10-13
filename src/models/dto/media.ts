export interface UpdateMediaDto {
  originalName?: string;
  metadata?: Record<string, any>;
  isActive?: boolean;
}

export interface UploadMediaDto {
  file: File;
  altText?: string;
  description?: string;
  isPublic?: boolean;
}