# Media API - Frontend Integration Guide

## 🎯 Overview

Media API đã được cập nhật để hỗ trợ đầy đủ các operations theo API guide mới:
- **Cross-category**: Tìm kiếm/filter toàn bộ media
- **Profile**: Quản lý ảnh profile của user
- **General**: Quản lý ảnh chung (cần permissions)

## 📁 File Structure

```
src/
├── api/
│   └── slices/
│       └── mediaApi.ts          # RTK Query API slice
├── models/
│   └── media.ts                 # TypeScript interfaces
├── constants/
│   └── media.ts                 # Media constants
├── helpers/
│   └── media.ts                 # Utility functions
├── hooks/
│   └── useMedia.ts              # Custom hooks
└── examples/
    └── MediaExample.tsx         # Usage examples
```

## 🚀 Quick Start

### 1. Import Hooks

```typescript
import { useMedia, useProfileMedia, useGeneralMedia, useMediaUtils } from '@/hooks/useMedia';
```

### 2. Basic Usage

```typescript
const MyComponent = () => {
  const media = useMedia();
  const profileMedia = useProfileMedia();
  const generalMedia = useGeneralMedia();
  const mediaUtils = useMediaUtils();

  // Search media
  const { data: searchResults, isLoading } = media.searchMedia({
    q: 'search query',
    category: 'general',
    page: 1,
    limit: 10
  });

  // Upload profile image
  const [uploadProfileImage] = profileMedia.uploadProfileImage;
  
  const handleUpload = async (file: File) => {
    try {
      await uploadProfileImage(file);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div>
      {/* Your component JSX */}
    </div>
  );
};
```

## 📋 Available Hooks

### useMedia()
Cross-category operations:
- `searchMedia(params)` - Search media
- `filterMedia(params)` - Filter media
- `getAllTags()` - Get all tags
- `getMediaByTag(params)` - Get media by tag
- `getFileUrl(params)` - Get file URL

### useProfileMedia()
Profile-specific operations:
- `uploadProfileImage(file)` - Upload single image
- `uploadMultipleProfileImages(files)` - Upload multiple images
- `listProfileImages(params)` - List profile images
- `getProfileImageDetails(id)` - Get image details
- `getProfileImageSizes(id)` - Get available sizes
- `updateProfileImage({id, data})` - Update image
- `deleteProfileImage(id)` - Delete image
- `searchProfileImages(params)` - Search profile images
- `filterProfileImages(params)` - Filter profile images
- `getProfileImagesByTag(params)` - Get by tag
- `getProfileImageFileUrl(params)` - Get file URL

### useGeneralMedia()
General media operations (same as profile but for general category):
- `uploadGeneralImage(file)`
- `uploadMultipleGeneralImages(files)`
- `listGeneralImages(params)`
- `getGeneralImageDetails(id)`
- `getGeneralImageSizes(id)`
- `updateGeneralImage({id, data})`
- `deleteGeneralImage(id)`
- `searchGeneralImages(params)`
- `filterGeneralImages(params)`
- `getGeneralImagesByTag(params)`
- `getGeneralImageFileUrl(params)`

### useMediaUtils()
Utility functions:
- `generateFileUrl(mediaId, category, size)` - Generate file URL
- `generateThumbnailUrl(mediaId, category)` - Generate thumbnail URL
- `generateDisplayUrl(mediaId, category, size)` - Generate display URL
- `convertToMedia(apiMedia)` - Convert API response to Media

## 🔧 Helper Functions

### Media Helpers (`src/helpers/media.ts`)

```typescript
import { 
  convertApiMediaToMedia,
  generateMediaFileUrl,
  generateMediaThumbnailUrl,
  formatFileSize,
  formatFileType,
  isImageFile,
  validateFileForUpload
} from '@/helpers/media';

// Convert API response
const media = convertApiMediaToMedia(apiResponse);

// Generate URLs
const fileUrl = generateMediaFileUrl(mediaId, 'profile', 'medium');
const thumbnailUrl = generateMediaThumbnailUrl(mediaId, 'general');

// Format data
const sizeText = formatFileSize(1024000); // "1.02 MB"
const typeText = formatFileType('image/jpeg'); // "JPEG Image"

// Validation
const validation = validateFileForUpload(file, 'profile', 5 * 1024 * 1024);
if (!validation.isValid) {
  console.error(validation.error);
}
```

## 📊 Constants

### Media Constants (`src/constants/media.ts`)

```typescript
import { 
  MEDIA_CATEGORIES,
  MEDIA_FILE_TYPES,
  MEDIA_IMAGE_SIZES,
  SUPPORTED_IMAGE_TYPES,
  FILE_SIZE_LIMITS
} from '@/constants/media';

// Categories
const category = MEDIA_CATEGORIES.PROFILE; // 'profile'
const general = MEDIA_CATEGORIES.GENERAL; // 'general'

// File types
const imageType = MEDIA_FILE_TYPES.IMAGE; // 'image'

// Image sizes
const thumbnail = MEDIA_IMAGE_SIZES.THUMBNAIL; // 'thumbnail'
const original = MEDIA_IMAGE_SIZES.ORIGINAL; // 'original'

// File size limits
const maxImageSize = FILE_SIZE_LIMITS.IMAGE; // 10MB
```

## 🎨 Image Sizes

Available image sizes:
- `thumbnail`: 150×150px
- `small`: 300×300px
- `medium`: 600×600px
- `large`: 1200×1200px
- `original`: Original size

## 📝 TypeScript Interfaces

### Core Interfaces

```typescript
interface Media {
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
  createdAt: Date;
  updatedAt: Date;
  url?: string;
  thumbnailUrl?: string;
}

interface MediaListResponse {
  data: MediaResponseDto[];
  total: number;
}

interface MediaListQueryDto {
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
```

## 🔐 Authentication & Permissions

### Headers Required
```typescript
// Automatically handled by axiosConfig.ts
Authorization: Bearer {jwt_token}
```

### Permission Requirements

#### Profile Operations
- **Authentication**: Required (JWT)
- **Authorization**: User chỉ có thể truy cập ảnh của chính họ
- **No Gateway Permission**: Không cần gateway permission

#### General Operations
- **Authentication**: Required (JWT)
- **Authorization**: Cần gateway permission
- **Permissions**: `medias.upload`, `medias.view`, `medias.edit`, `medias.delete`, `medias.download`

#### Cross-category Operations
- **Authentication**: Required (JWT)
- **Authorization**: Cần gateway permission
- **Permissions**: `medias.view`, `medias.download`

## 🚨 Error Handling

```typescript
const { data, error, isLoading } = media.searchMedia(params);

if (error) {
  console.error('API Error:', error);
  // Handle error based on error.statusCode
  switch (error.statusCode) {
    case 401:
      // Unauthorized - redirect to login
      break;
    case 403:
      // Forbidden - show permission error
      break;
    case 404:
      // Not found - show not found message
      break;
    default:
      // Generic error handling
      break;
  }
}
```

## 📱 Best Practices

### 1. File Upload
```typescript
const handleFileUpload = async (file: File) => {
  // Validate file before upload
  const validation = validateFileForUpload(file, 'profile');
  if (!validation.isValid) {
    setError(validation.error);
    return;
  }

  try {
    const result = await uploadProfileImage(file);
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

### 2. Image Display
```typescript
const ImageComponent = ({ media }: { media: Media }) => {
  const thumbnailUrl = generateMediaThumbnailUrl(media.id, media.category);
  const displayUrl = generateMediaDisplayUrl(media.id, media.category, 'medium');

  return (
    <div>
      <img 
        src={thumbnailUrl} 
        alt={media.originalName}
        className="w-32 h-32 object-cover"
      />
      <img 
        src={displayUrl} 
        alt={media.originalName}
        className="w-full h-64 object-cover"
      />
    </div>
  );
};
```

### 3. Pagination
```typescript
const MediaList = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const { data, isLoading } = generalMedia.listGeneralImages({
    page,
    limit,
    sortBy: 'createdAt',
    sortOrder: 'DESC'
  });

  return (
    <div>
      {/* Render media list */}
      {data?.data.map(media => (
        <MediaItem key={media.id} media={media} />
      ))}
      
      {/* Pagination controls */}
      <Pagination 
        currentPage={page}
        totalPages={Math.ceil((data?.total || 0) / limit)}
        onPageChange={setPage}
      />
    </div>
  );
};
```

### 4. Search with Debouncing
```typescript
const SearchableMediaList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebounce(searchQuery, 500);

  const { data, isLoading } = media.searchMedia({
    q: debouncedQuery,
    category: 'general',
    page: 1,
    limit: 20
  });

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search media..."
      />
      {/* Render results */}
    </div>
  );
};
```

## 🔄 Migration from Legacy API

### Before (Legacy)
```typescript
import { mediaApi } from '@/api/slices/mediaApi';

const images = await mediaApi.getImages({ category: 'general' });
const uploaded = await mediaApi.uploadImage(file);
```

### After (New)
```typescript
import { useMedia, useProfileMedia } from '@/hooks/useMedia';

const MyComponent = () => {
  const media = useMedia();
  const profileMedia = useProfileMedia();
  
  const { data: images } = media.filterMedia({ category: 'general' });
  const [uploadImage] = profileMedia.uploadProfileImage;
  
  const handleUpload = async (file: File) => {
    await uploadImage(file);
  };
};
```

## 🧪 Testing

See `src/examples/MediaExample.tsx` for comprehensive usage examples.

## 📚 Additional Resources

- [RTK Query Documentation](https://redux-toolkit.js.org/rtk-query/overview)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Hooks Guide](https://reactjs.org/docs/hooks-intro.html)
