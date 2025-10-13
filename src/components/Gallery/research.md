# Media Gallery - Technical Research

## Current Architecture Analysis

### Existing Components
- **BaseGallery**: Core UI component với page-based pagination
- **ProfileGallery**: Specialized wrapper cho profile images
- **mediaApi**: RTK Query endpoints cho profile/general media

### Current Data Flow
```
ProfileGallery → useProfileMedia → mediaApi → Backend
                ↓
            BaseGallery (UI)
```

## Technical Approach

### 1. Infinite Scroll Implementation

#### Option A: Intersection Observer API (Recommended)
```typescript
// Advantages:
- Modern, performant
- Non-blocking main thread
- Built-in browser support
- Easy to implement với React hooks

// Implementation:
const useInfiniteScroll = (loadMore, hasNextPage, loading) => {
  const [node, setNode] = useState<HTMLElement | null>(null);
  
  useEffect(() => {
    if (!node || !hasNextPage || loading) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(node);
    return () => observer.disconnect();
  }, [node, hasNextPage, loading]);
  
  return [setNode];
};
```

#### Option B: Scroll Event Listener
```typescript
// Advantages:
- More control
- Works với older browsers

// Disadvantages:
- Blocking main thread
- Need manual throttling
- More complex cleanup
```

### 2. Data Accumulation Strategy

#### Current: Replace Data
```typescript
// Current approach
const images: Media[] = imagesData?.data?.map(convertApiMediaToMedia) || [];
```

#### New: Accumulate Data
```typescript
// New approach
const [allImages, setAllImages] = useState<Media[]>([]);

// Initial load
useEffect(() => {
  if (imagesData?.data) {
    setAllImages(imagesData.data.map(convertApiMediaToMedia));
  }
}, [imagesData]);

// Load more
const loadMore = () => {
  if (nextCursor) {
    // Append new data
    setAllImages(prev => [...prev, ...newImages]);
  }
};
```

### 3. Performance Optimization

#### Debounce Search
```typescript
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};
```

#### Throttle Scroll
```typescript
const useThrottle = (callback: Function, delay: number) => {
  const lastRun = useRef(Date.now());
  
  return useCallback((...args: any[]) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = Date.now();
    }
  }, [callback, delay]);
};
```

### 4. Image Lazy Loading

#### Intersection Observer for Images
```typescript
const useLazyImage = (src: string) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setImageSrc(src);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => observer.disconnect();
  }, [src]);
  
  return { imgRef, imageSrc, isLoaded };
};
```

### 5. Selection State Management

#### Global Selection State
```typescript
// Current: Local state trong BaseGallery
const [selectedImageIds, setSelectedImageIds] = useState<Set<string>>();

// New: Lift state up to ProfileGallery
const [selectedImageIds, setSelectedImageIds] = useState<Set<string>>(
  new Set(selectedImages.map(img => img.id))
);

// Persist across pages - using Set for performance
const handleImageSelect = (image: Media) => {
  setSelectedImageIds(prev => {
    const newSet = new Set(prev);
    if (newSet.has(image.id)) {
      newSet.delete(image.id);
    } else {
      newSet.add(image.id);
    }
    return newSet;
  });
};

// Clear selection
const clearSelection = () => {
  setSelectedImageIds(new Set());
};

// Max selection limit
const canSelect = (imageId: string) => {
  if (selectedImageIds.has(imageId)) return true;
  return selectedImageIds.size < maxSelection;
};
```

### 6. Loading States Architecture

#### Separate Loading States
```typescript
interface LoadingStates {
  loading: boolean;        // Initial load
  loadingMore: boolean;    // Load more data
  uploading: boolean;      // Upload operations
  searching: boolean;      // Search operations
}

// Usage
const { loading, loadingMore, uploading } = useLoadingStates();

// Loading UI với Ant Design Spin
const LoadingIndicator = ({ loadingMore }: { loadingMore: boolean }) => (
  <div style={{ textAlign: 'center', padding: '20px' }}>
    <Spin size="default" />
    <div style={{ marginTop: '8px' }}>Loading more...</div>
  </div>
);
```

### 7. Error Handling Strategy

#### Retry Logic
```typescript
const useRetry = (fn: Function, maxRetries: number = 3) => {
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  
  const retry = useCallback(() => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      fn();
    }
  }, [fn, retryCount, maxRetries]);
  
  return { retry, retryCount, error };
};
```

### 8. Memory Management

#### Data Cleanup Strategy
```typescript
// Option 1: Keep all data (simple)
const [allImages, setAllImages] = useState<Media[]>([]);

// Option 2: Sliding window (complex but memory efficient)
const useSlidingWindow = (maxSize: number) => {
  const [images, setImages] = useState<Media[]>([]);
  
  const addImages = (newImages: Media[]) => {
    setImages(prev => {
      const combined = [...prev, ...newImages];
      return combined.length > maxSize 
        ? combined.slice(-maxSize) 
        : combined;
    });
  };
};
```

## API Integration

### Current API Structure
```typescript
// Profile images API
listProfileImages: builder.query<
  InfinitePaginationResult<Media>,
  InfiniteParamsDto<Media>
>({
  query: (params) => ({
    url: '/medias/profile',
    method: 'GET',
    params,
  }),
}),
```

### Required Changes
- ✅ API already supports cursor-based pagination
- ✅ `InfinitePaginationResult<Media>` type exists
- ✅ `InfiniteParamsDto<Media>` type exists
- ✅ Backend endpoints ready

## Component Architecture

### Updated Component Structure
```
ProfileGallery (State Management)
├── useInfiniteScroll (Scroll Detection)
├── useProfileMedia (API Calls)
├── useDebounce (Search Optimization)
└── BaseGallery (UI Rendering - NO LAYOUT CHANGES)
    ├── useLazyImage (Image Loading)
    ├── useThrottle (Scroll Optimization)
    ├── Selection Logic (Set<string>)
    └── LoadingIndicator (Ant Design Spin)
```

### Implementation Constraints

#### Technical Constraints
- ✅ **Layout**: Không được sửa layout component hiện tại
- ✅ **Loading**: Sử dụng Ant Design Spin component
- ✅ **Selection**: Sử dụng Set<string> thay vì array
- ✅ **UI**: Giữ nguyên existing UI structure, chỉ thêm logic

#### API Constraints (from existing interfaces)
```typescript
// InfinitePaginationResult<Media> structure
interface InfinitePaginationResult<Media> {
  data: Media[];                    // Array of media items
  pagination: {
    hasNextPage: boolean;          // Has more data to load
    hasPrevPage: boolean;          // Has previous data
    nextCursor: string | null;     // Cursor for next page
    prevCursor: string | null;     // Cursor for previous page
    limit: number;                 // Items per page
  };
}

// InfiniteParamsDto<Media> structure
interface InfiniteParamsDto<Media> {
  limit?: number;                  // Max 100 (DEFAULT_PAGINATION.MAX_LIMIT)
  cursor?: string;                 // Cursor for pagination
  search?: string;                 // Search query
  filters?: FilterField[];         // Filter options
  sorts?: SortField<Media>[];      // Sort options
  direction?: 'next' | 'prev';     // Scroll direction
}

// Media constraints
interface Media {
  id: string;
  category: 'profile' | 'general'; // MEDIA_CATEGORIES
  fileType: 'image' | 'audio' | 'video'; // MEDIA_FILE_TYPES
  sizes: MediaSize[];              // Available image sizes
  isActive: boolean;               // Active status
  // ... other fields
}

// Sort options (MEDIA_SORT_OPTIONS)
const SORT_FIELDS = {
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt', 
  ORIGINAL_NAME: 'originalName',
  FILE_SIZE: 'size',
  UPLOADER_ID: 'uploaderId',
} as const;

// File limits (FILE_SIZE_LIMITS)
const FILE_LIMITS = {
  IMAGE: 10 * 1024 * 1024,        // 10MB max
  AUDIO: 50 * 1024 * 1024,        // 50MB max
  VIDEO: 100 * 1024 * 1024,       // 100MB max
} as const;
```

## Testing Strategy

### Unit Tests
- useInfiniteScroll hook
- useDebounce/useThrottle hooks
- Selection logic
- Data accumulation logic

### Integration Tests
- End-to-end infinite scroll
- Search với infinite scroll
- Upload với refresh
- Selection persistence

### Performance Tests
- Large dataset handling
- Memory usage monitoring
- Scroll performance
- Image loading performance

## Browser Compatibility

### Intersection Observer
- ✅ Chrome 51+
- ✅ Firefox 55+
- ✅ Safari 12.1+
- ✅ Edge 15+

### Fallback Strategy
```typescript
// Fallback to scroll event listener
const useInfiniteScrollFallback = (loadMore, hasNextPage, loading) => {
  // Scroll event listener implementation
};
```

## Security Considerations

### Image Loading
- Validate image URLs
- Handle broken images
- Prevent XSS through image sources

### Data Validation
- Validate API responses
- Handle malformed data
- Prevent memory leaks

## Accessibility

### Keyboard Navigation
- Tab navigation through images
- Space/Enter to select
- Arrow keys for navigation

### Screen Reader Support
- Proper ARIA labels
- Loading state announcements
- Selection count announcements

### Focus Management
- Maintain focus khi load more
- Focus management trong modal
- Skip links for long lists
