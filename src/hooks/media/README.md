# Media Hooks

## 🎯 Overview

Media hooks đã được tách thành các hooks riêng biệt để dễ quản lý và maintain hơn. Cấu trúc bao gồm:

- **useMediaUtils**: Utilities chung cho tất cả media operations
- **useProfileMedia**: Hook chuyên dụng cho profile media
- **useGeneralMedia**: Hook chuyên dụng cho general media

## 📁 Cấu trúc Files

```
src/hooks/media/
├── useMediaUtils.ts     # Utilities chung
├── useProfileMedia.ts  # Profile media operations
├── useGeneralMedia.ts  # General media operations
├── index.ts           # Exports
└── README.md         # Documentation
```

## 🚀 Usage Examples

### Media Utils (Chung)
```typescript
import { useMediaUtils } from '@/hooks/media';

const MyComponent = () => {
  const { getThumbnailUrl, getDisplayUrl, convertToMedia } = useMediaUtils();
  
  // Get image sizes from API
  const { data: sizes } = useGetProfileImageSizesQuery(mediaId);
  
  const thumbnailUrl = getThumbnailUrl(sizes?.sizes || []);
  const displayUrl = getDisplayUrl(sizes?.sizes || []);
  const media = convertToMedia(apiResponse);
  
  return <div>...</div>;
};
```

### Profile Media
```typescript
import { useProfileMedia } from '@/hooks/media';

const ProfileComponent = () => {
  const { 
    uploadProfileImage, 
    listProfileImages, 
    deleteProfileImage 
  } = useProfileMedia();
  
  const { data: images, isLoading } = listProfileImages({
    limit: 20,
    cursor: undefined
  });
  
  const handleUpload = async (file: File) => {
    await uploadProfileImage({ file });
  };
  
  return <div>...</div>;
};
```

### General Media
```typescript
import { useGeneralMedia } from '@/hooks/media';

const GeneralComponent = () => {
  const { 
    uploadGeneralImage, 
    listGeneralImages, 
    deleteGeneralImage 
  } = useGeneralMedia();
  
  const { data: images, isLoading } = listGeneralImages({
    limit: 20,
    cursor: undefined
  });
  
  const handleUpload = async (file: File) => {
    await uploadGeneralImage({ file });
  };
  
  return <div>...</div>;
};
```


## 🔧 Hook Details

### useMediaUtils
```typescript
interface MediaUtilsReturn {
  convertToMedia: (apiMedia: MediaResponseDto) => Media;
  getImageUrl: (sizes: MediaSizeResponseDto[], sizeName: string) => string | null;
  getThumbnailUrl: (sizes: MediaSizeResponseDto[]) => string | null;
  getDisplayUrl: (sizes: MediaSizeResponseDto[]) => string | null;
  getBestSizeUrl: (sizes: MediaSizeResponseDto[], preferredSize?: string) => string | null;
  getAvailableSizes: (sizes: MediaSizeResponseDto[]) => string[];
  hasSize: (sizes: MediaSizeResponseDto[], sizeName: string) => boolean;
  getSizeDimensions: (sizes: MediaSizeResponseDto[], sizeName: string) => { width: number; height: number } | null;
}
```

### useProfileMedia
```typescript
interface ProfileMediaReturn {
  // Mutations
  uploadProfileImage: (params: { file: File }) => Promise<any>;
  uploadProfileImageResult: any;
  uploadMultipleProfileImages: (params: { files: File[] }) => Promise<any>;
  uploadMultipleProfileImagesResult: any;
  updateProfileImage: (params: { id: string; data: UpdateMediaDto }) => Promise<any>;
  updateProfileImageResult: any;
  deleteProfileImage: (id: string) => Promise<any>;
  deleteProfileImageResult: any;
  
  // Query hooks
  listProfileImages: (params: { cursor?: string; limit?: number }) => any;
  getProfileImageDetails: (id: string) => any;
  getProfileImageSizes: (id: string) => any;
}
```

### useGeneralMedia
```typescript
interface GeneralMediaReturn {
  // Mutations
  uploadGeneralImage: (params: { file: File }) => Promise<any>;
  uploadGeneralImageResult: any;
  uploadMultipleGeneralImages: (params: { files: File[] }) => Promise<any>;
  uploadMultipleGeneralImagesResult: any;
  updateGeneralImage: (params: { id: string; data: UpdateMediaDto }) => Promise<any>;
  updateGeneralImageResult: any;
  deleteGeneralImage: (id: string) => Promise<any>;
  deleteGeneralImageResult: any;
  
  // Query hooks
  listGeneralImages: (params: { cursor?: string; limit?: number }) => any;
  getGeneralImageDetails: (id: string) => any;
  getGeneralImageSizes: (id: string) => any;
}
```


## 🔄 Backward Compatibility

- Legacy `useMedia` hook vẫn hoạt động bình thường
- Có thể import từ `@/hooks` như cũ
- Không breaking changes với existing code

## 🧪 Testing

```typescript
// Test Media Utils
import { renderHook } from '@testing-library/react';
import { useMediaUtils } from '@/hooks/media';

test('useMediaUtils generates correct URLs', () => {
  const { result } = renderHook(() => useMediaUtils());
  
  const thumbnailUrl = result.current.generateThumbnailUrl('test-id', 'profile');
  expect(thumbnailUrl).toContain('test-id');
  expect(thumbnailUrl).toContain('profile');
});

// Test Profile Media
test('useProfileMedia provides correct hooks', () => {
  const { result } = renderHook(() => useProfileMedia());
  
  expect(result.current.uploadProfileImage).toBeDefined();
  expect(result.current.listProfileImages).toBeDefined();
  expect(result.current.deleteProfileImage).toBeDefined();
});
```

## 📚 Benefits

1. **Separation of Concerns**: Mỗi hook có responsibility riêng biệt
2. **Easier Maintenance**: Dễ dàng maintain và debug từng hook
3. **Better Testing**: Có thể test từng hook riêng biệt
4. **Reduced Bundle Size**: Chỉ import hook cần thiết
5. **Type Safety**: Props được type rõ ràng cho từng hook
6. **Backward Compatibility**: Không breaking changes
7. **No Duplication**: Loại bỏ code lặp lại giữa các hooks
