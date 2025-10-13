# Media Gallery - Implementation Plan

## Overview
Chuyển đổi Media Gallery từ page-based pagination sang infinite scroll với cursor-based pagination.

## Phase 1: Core Infrastructure (Priority: High)

### 1.1 Custom Hook - useInfiniteScroll
- **File**: `src/hooks/media/useInfiniteScroll.ts`
- **Purpose**: Intersection Observer API + data accumulation logic
- **Features**:
  - Detect scroll đến cuối list
  - Load more data automatically
  - Throttle scroll events (100ms)
  - Return loading states và ref

### 1.2 Debounce/Throttle Utilities
- **File**: `src/hooks/useDebounce.ts`, `src/hooks/useThrottle.ts`
- **Purpose**: Performance optimization cho search và scroll
- **Features**:
  - useDebounce: 300ms cho search input
  - useThrottle: 100ms cho scroll events

### 1.3 Loading States Management
- **File**: Update existing hooks
- **Purpose**: Separate loading states cho initial vs load more
- **Features**:
  - `loading`: Initial load
  - `loadingMore`: Load more data
  - `uploading`: Upload operations

## Phase 2: UI/UX Improvements (Priority: High)

### 2.1 Loading Indicator
- **File**: Update `BaseGallery.tsx`
- **Purpose**: Show loading ở cuối list thay vì overlay
- **Features**:
  - Ant Design Spin component ở cuối list
  - "Loading more..." text với Spin
  - "No more data" indicator

### 2.2 Image Lazy Loading
- **File**: `src/hooks/useLazyImage.ts`
- **Purpose**: Load images chỉ khi visible
- **Features**:
  - Intersection Observer cho images
  - Placeholder while loading
  - Error fallback

### 2.3 Selection Persistence
- **File**: Update `BaseGallery.tsx`
- **Purpose**: Selection persist across pages
- **Features**:
  - Global selection state using Set<string>
  - Persist khi load more
  - Clear selection functionality

### 2.4 Max Selection Limit
- **File**: Update `BaseGallery.tsx`
- **Purpose**: Visual feedback khi đạt limit
- **Features**:
  - Max selection validation
  - Disable selection khi đạt limit
  - Visual feedback (opacity, cursor)

## Phase 3: Integration & Polish (Priority: Medium)

### 3.1 Upload Refresh Logic
- **File**: Update `ProfileGallery.tsx`
- **Purpose**: Proper refresh sau upload
- **Features**:
  - Reset cursor về đầu
  - Reload data
  - Show new uploads

### 3.2 Error Handling
- **File**: Update hooks và components
- **Purpose**: Retry logic cho failed loads
- **Features**:
  - Retry button cho failed loads
  - Error messages
  - Fallback states

### 3.3 Performance Optimization
- **File**: Update hooks
- **Purpose**: Memory management
- **Features**:
  - Cleanup old data nếu cần
  - Optimize re-renders
  - Memory leak prevention

## Phase 4: Advanced Features (Priority: Low)

### 4.1 Search & Filter Integration
- **File**: Update `ProfileGallery.tsx`
- **Purpose**: Search/filter với infinite scroll
- **Features**:
  - Reset cursor khi search/filter
  - Debounced search
  - Filter persistence

### 4.2 Sort Integration
- **File**: Update `ProfileGallery.tsx`
- **Purpose**: Sort với infinite scroll
- **Features**:
  - Reset cursor khi sort
  - Sort persistence
  - Loading states

## Implementation Constraints

### Technical Constraints
- ✅ **Layout**: Không được sửa layout component hiện tại, chỉ implement logic
- ✅ **Loading**: Sử dụng Ant Design Spin component
- ✅ **Selection**: Sử dụng Set<string> thay vì array cho performance
- ✅ **UI**: Giữ nguyên existing UI structure

### API Constraints (from existing interfaces)
- ✅ **InfinitePaginationResult<Media>**: 
  - `data: Media[]` - Array of media items
  - `pagination.hasNextPage: boolean` - Has more data to load
  - `pagination.nextCursor: string | null` - Cursor for next page
  - `pagination.limit: number` - Items per page
- ✅ **InfiniteParamsDto<Media>**:
  - `limit?: number` - Max 100 (DEFAULT_PAGINATION.MAX_LIMIT)
  - `cursor?: string` - Cursor for pagination
  - `search?: string` - Search query
  - `sorts?: SortField<Media>[]` - Sort options
  - `direction?: 'next' | 'prev'` - Scroll direction
- ✅ **Media Constraints**:
  - `category: 'profile' | 'general'` - Media category
  - `fileType: 'image' | 'audio' | 'video'` - File type
  - `sizes: MediaSize[]` - Available image sizes
  - `isActive: boolean` - Active status
- ✅ **Sort Options** (MEDIA_SORT_OPTIONS):
  - `createdAt`, `updatedAt`, `originalName`, `size`, `uploaderId`
- ✅ **File Limits**:
  - Images: 10MB max (FILE_SIZE_LIMITS.IMAGE)
  - Supported types: JPEG, PNG, WebP, GIF

## Implementation Order

1. **Week 1**: Phase 1 (Core Infrastructure)
2. **Week 2**: Phase 2 (UI/UX Improvements)
3. **Week 3**: Phase 3 (Integration & Polish)
4. **Week 4**: Phase 4 (Advanced Features) - Optional

## Success Criteria

- ✅ Infinite scroll hoạt động smooth
- ✅ Selection persist across pages
- ✅ Performance tốt với large datasets
- ✅ Loading states rõ ràng
- ✅ Error handling robust
- ✅ Mobile responsive
- ✅ Accessibility compliant

## Risks & Mitigation

- **Risk**: Memory leaks với large datasets
  - **Mitigation**: Implement data cleanup logic
- **Risk**: Performance issues với many images
  - **Mitigation**: Lazy loading + virtualization nếu cần
- **Risk**: Selection state complexity
  - **Mitigation**: Centralized state management
