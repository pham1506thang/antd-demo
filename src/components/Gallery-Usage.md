# Gallery Component - Usage Guide

## 🎯 Overview

Gallery component đã được cập nhật để hỗ trợ cả Profile và General media thông qua prop `category`. Component sẽ tự động customize UI dựa trên category được truyền vào.

## 📋 Props Interface

```typescript
interface GalleryModalProps {
  open: boolean;
  onClose: () => void;
  mode: 'single' | 'multiple';
  onSelect: (mediaItems: Media[]) => void;
  selectedImages?: Media[];
  category: 'general' | 'profile'; // Required prop
}
```

## 🚀 Usage Examples

### Profile Gallery
```typescript
import { GalleryModal } from '@/components';

const ProfileGalleryExample = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Media[]>([]);

  return (
    <GalleryModal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      category="profile"
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
import { GalleryModal } from '@/components';

const GeneralGalleryExample = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Media[]>([]);

  return (
    <GalleryModal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      category="general"
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

## 🎨 UI Customization

Component sẽ tự động customize UI dựa trên `category` prop:

### Profile Category (`category="profile"`)
- **Title**: "Chọn ảnh Profile"
- **Search placeholder**: "Tìm kiếm ảnh profile..."
- **Upload button**: "Upload Profile"
- **Info text**: "Hiển thị X / Y ảnh profile"
- **Pagination**: "X-Y / Z ảnh profile"

### General Category (`category="general"`)
- **Title**: "Chọn ảnh"
- **Search placeholder**: "Tìm kiếm ảnh..."
- **Upload button**: "Upload"
- **Info text**: "Hiển thị X / Y ảnh"
- **Pagination**: "X-Y / Z ảnh"

## 🔧 Features

- **Search**: Tìm kiếm với debouncing
- **Sorting**: Sắp xếp theo ngày tạo, tên file, kích thước
- **Pagination**: Phân trang với quick jumper
- **Upload**: Upload ảnh với proper error handling
- **Selection**: Single hoặc multiple selection
- **Preview**: Click để xem ảnh full size

## 🔐 Permissions

### Profile Category
- **Authentication**: Required (JWT)
- **Authorization**: User chỉ có thể truy cập ảnh profile của chính họ
- **No Gateway Permission**: Không cần gateway permission

### General Category
- **Authentication**: Required (JWT)
- **Authorization**: Cần gateway permission
- **Permissions**: `medias.upload`, `medias.view`, `medias.edit`, `medias.delete`, `medias.download`

## 🎯 Best Practices

1. **Always specify category**: Prop `category` là required
2. **Use appropriate mode**: `single` cho avatar, `multiple` cho gallery
3. **Handle selection**: Implement proper `onSelect` callback
4. **Error handling**: Handle upload và API errors
5. **Loading states**: Show loading khi cần thiết

## 🧪 Testing

```typescript
// Test Profile Gallery
const { getByText } = render(
  <GalleryModal
    open={true}
    onClose={jest.fn()}
    category="profile"
    mode="single"
    onSelect={jest.fn()}
  />
);

expect(getByText('Chọn ảnh Profile')).toBeInTheDocument();
expect(getByText('Tìm kiếm ảnh profile...')).toBeInTheDocument();

// Test General Gallery
const { getByText } = render(
  <GalleryModal
    open={true}
    onClose={jest.fn()}
    category="general"
    mode="multiple"
    onSelect={jest.fn()}
  />
);

expect(getByText('Chọn ảnh')).toBeInTheDocument();
expect(getByText('Tìm kiếm ảnh...')).toBeInTheDocument();
```

## 📚 Additional Notes

- **Backward Compatibility**: Component vẫn hoạt động như cũ
- **Performance**: Chỉ load hook cần thiết dựa trên category
- **Maintainability**: Logic được centralized trong một component
- **Extensibility**: Dễ dàng thêm features mới cho cả 2 categories
