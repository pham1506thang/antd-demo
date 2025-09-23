# Gallery Components

## 🎯 Overview

Gallery components đã được tách thành các component riêng biệt để dễ quản lý và maintain hơn. Cấu trúc bao gồm:

- **BaseGallery**: Component chung chứa toàn bộ layout và UI
- **ProfileGallery**: Gallery chuyên dụng cho ảnh profile
- **GeneralGallery**: Gallery chuyên dụng cho ảnh general

## 📁 Cấu trúc Files

```
src/components/Gallery/
├── BaseGallery.tsx      # Component chung với layout
├── ProfileGallery.tsx  # Gallery cho profile images
├── GeneralGallery.tsx  # Gallery cho general images
├── index.ts            # Exports
└── README.md          # Documentation
```

## 🚀 Usage Examples

### Profile Gallery
```typescript
import { ProfileGallery } from '@/components/Gallery';

const ProfileGalleryExample = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Media[]>([]);

  return (
    <ProfileGallery
      open={isOpen}
      onClose={() => setIsOpen(false)}
      mode="single"
      onSelect={(images) => {
        setSelectedImages(images);
        console.log('Selected profile images:', images);
      }}
      selectedImages={selectedImages}
    />
  );
};
```

### General Gallery
```typescript
import { GeneralGallery } from '@/components/Gallery';

const GeneralGalleryExample = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Media[]>([]);

  return (
    <GeneralGallery
      open={isOpen}
      onClose={() => setIsOpen(false)}
      mode="multiple"
      onSelect={(images) => {
        setSelectedImages(images);
        console.log('Selected general images:', images);
      }}
      selectedImages={selectedImages}
    />
  );
};
```

## 🔧 Component Props

### ProfileGallery & GeneralGallery
```typescript
interface GalleryProps {
  open: boolean;
  onClose: () => void;
  mode: 'single' | 'multiple';
  onSelect: (mediaItems: Media[]) => void;
  selectedImages?: Media[];
}
```

### BaseGallery
```typescript
interface BaseGalleryProps {
  // Modal props
  open: boolean;
  onClose: () => void;
  mode: 'single' | 'multiple';
  onSelect: (mediaItems: Media[]) => void;
  selectedImages?: Media[];
  category: 'general' | 'profile';
  
  // Data and loading states
  images: Media[];
  loading: boolean;
  totalImages: number;
  currentPage: number;
  pageSize: number;
  
  // Search and sort states
  searchText: string;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
  
  // Event handlers
  onSearch: (value: string) => void;
  onSortChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onImageSelect: (image: Media) => void;
  onUpload: (file: File) => Promise<void>;
  
  // UI customization
  title: string;
  searchPlaceholder: string;
  uploadButtonText: string;
  infoText: string;
  paginationText: (total: number, range: [number, number]) => string;
  
  // Media utilities
  generateThumbnailUrl: (mediaId: string, category: 'general' | 'profile') => string;
  generateDisplayUrl: (mediaId: string, category: 'general' | 'profile', size: string) => string;
}
```

## 🎨 UI Customization

### Profile Gallery
- **Title**: "Chọn ảnh Profile"
- **Search placeholder**: "Tìm kiếm ảnh profile..."
- **Upload button**: "Upload Profile"
- **Info text**: "Hiển thị X / Y ảnh profile"
- **Pagination**: "X-Y / Z ảnh profile"

### General Gallery
- **Title**: "Chọn ảnh"
- **Search placeholder**: "Tìm kiếm ảnh..."
- **Upload button**: "Upload"
- **Info text**: "Hiển thị X / Y ảnh"
- **Pagination**: "X-Y / Z ảnh"

## 🔄 Backward Compatibility

- Legacy `GalleryModal` component vẫn hoạt động bình thường
- Có thể import từ `@/components` như cũ
- Không breaking changes với existing code

## 🧪 Testing

```typescript
// Test Profile Gallery
import { render } from '@testing-library/react';
import { ProfileGallery } from '@/components/Gallery';

test('ProfileGallery renders correctly', () => {
  const { getByText } = render(
    <ProfileGallery
      open={true}
      onClose={jest.fn()}
      mode="single"
      onSelect={jest.fn()}
    />
  );
  
  expect(getByText('Chọn ảnh Profile')).toBeInTheDocument();
  expect(getByText('Tìm kiếm ảnh profile...')).toBeInTheDocument();
});

// Test General Gallery
test('GeneralGallery renders correctly', () => {
  const { getByText } = render(
    <GeneralGallery
      open={true}
      onClose={jest.fn()}
      mode="multiple"
      onSelect={jest.fn()}
    />
  );
  
  expect(getByText('Chọn ảnh')).toBeInTheDocument();
  expect(getByText('Tìm kiếm ảnh...')).toBeInTheDocument();
});
```

## 📚 Benefits

1. **Separation of Concerns**: Mỗi gallery có logic riêng biệt
2. **Easier Maintenance**: Dễ dàng maintain và debug
3. **Better Testing**: Có thể test từng gallery riêng biệt
4. **Reusability**: BaseGallery có thể được extend cho các use cases khác
5. **Type Safety**: Props được type rõ ràng cho từng component
6. **Backward Compatibility**: Không breaking changes
