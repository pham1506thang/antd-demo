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
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  metadata: Record<string, any>;
  url: string; // For display
  thumbnailUrl: string; // For grid display
}

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