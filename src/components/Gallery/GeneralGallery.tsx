import React, { useState } from 'react';
import type { MediaImage } from '@/models/media';
import { useGeneralMediaInfinite } from '@/hooks/media';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { MEDIA_CATEGORIES } from '@/constants/media';
import { BaseGallery } from './BaseGallery';

export interface GeneralGalleryProps {
  open: boolean;
  onClose: () => void;
  mode: 'single' | 'multiple';
  onSelect: (mediaItems: MediaImage[]) => void;
  selectedImages?: MediaImage[];
}

export const GeneralGallery: React.FC<GeneralGalleryProps> = ({
  open,
  onClose,
  mode = 'single',
  onSelect,
  selectedImages = [],
}) => {
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  const {
    images,
    hasNextPage,
    loading,
    loadingMore,
    loadMore,
    refresh,
    search,
    sort,
    uploadGeneralImage,
  } = useGeneralMediaInfinite({
    search: searchText,
    sortBy,
    sortOrder,
    limit: 20,
  });

  const { loadMoreRef } = useInfiniteScroll(
    loadMore,
    hasNextPage,
    loadingMore,
    { enabled: open }
  );

  const handleSearch = (value: string) => {
    setSearchText(value);
    search(value);
  };

  const handleSortChange = (value: string) => {
    const [newSortBy, newSortOrder] = value.split('_');
    setSortBy(newSortBy);
    setSortOrder(newSortOrder as 'ASC' | 'DESC');
    sort(newSortBy, newSortOrder as 'ASC' | 'DESC');
  };

  const handleImageSelect = (image: MediaImage) => {
    // Additional logic for general image selection if needed
  };

  const handleUpload = async (file: File) => {
    try {
      await uploadGeneralImage({ 
        file,
        altText: '',
        description: '',
        isPublic: false
      });
      refresh();
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const getTitle = () => 'Chọn ảnh';
  const getSearchPlaceholder = () => 'Tìm kiếm ảnh...';
  const getUploadButtonText = () => 'Upload';
  const getInfoText = () => `Hiển thị ${images.length} ảnh`;

  return (
    <BaseGallery
      open={open}
      onClose={onClose}
      mode={mode}
      onSelect={onSelect}
      selectedImages={selectedImages}
      category={MEDIA_CATEGORIES.GENERAL}
      images={images}
      loading={loading}
      loadingMore={loadingMore}
      hasNextPage={hasNextPage}
      searchText={searchText}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSearch={handleSearch}
      onSortChange={handleSortChange}
      onImageSelect={handleImageSelect}
      onUpload={handleUpload}
      title={getTitle()}
      searchPlaceholder={getSearchPlaceholder()}
      uploadButtonText={getUploadButtonText()}
      infoText={getInfoText()}
      useInfiniteScroll={true}
      loadMoreRef={loadMoreRef}
    />
  );
};
