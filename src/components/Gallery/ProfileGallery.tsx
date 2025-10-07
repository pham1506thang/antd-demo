/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import type { Media } from '@/models/media';
import { useProfileMedia, useMediaUtils } from '@/hooks/media';
import { MEDIA_CATEGORIES } from '@/constants/media';
import { BaseGallery } from './BaseGallery';

export interface ProfileGalleryProps {
  open: boolean;
  onClose: () => void;
  mode: 'single' | 'multiple';
  onSelect: (_mediaItems: Media[]) => void;
  selectedImages?: Media[];
}

export const ProfileGallery: React.FC<ProfileGalleryProps> = ({
  open,
  onClose,
  mode = 'single',
  onSelect,
  selectedImages = [],
}) => {
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  // Initialize hooks
  const profileMedia = useProfileMedia();
  const mediaUtils = useMediaUtils();

  // Load profile images
  const { data: imagesData, isLoading: loading } = profileMedia.listProfileImages({
    page: currentPage,
    limit: pageSize,
    search: searchText || undefined,
    sortBy,
    sortOrder,
  });

  // Convert API response to Media format
  const images: Media[] = imagesData?.data?.map(mediaUtils.convertToMedia) || [];
  const totalImages = imagesData?.total || 0;

  // Event handlers
  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleSortChange = (value: string) => {
    const [newSortBy, newSortOrder] = value.split('_');
    setSortBy(newSortBy);
    setSortOrder(newSortOrder as 'ASC' | 'DESC');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleImageSelect = (_image: Media) => {
    // Additional logic for profile image selection if needed
  };

  const handleUpload = async (file: File) => {
    await profileMedia.uploadProfileImage({ 
      file,
      altText: '', // Can be enhanced to get from user input
      description: '', // Can be enhanced to get from user input
      isPublic: false // Default to private
    });
    setCurrentPage(1); // Reset to first page to show the new upload
  };

  // UI customization for profile gallery
  const getTitle = () => 'Chọn ảnh Profile';
  const getSearchPlaceholder = () => 'Tìm kiếm ảnh profile...';
  const getUploadButtonText = () => 'Upload Profile';
  const getInfoText = () => `Hiển thị ${images.length} / ${totalImages} ảnh profile`;
  const getPaginationText = (total: number, range: [number, number]) => 
    `${range[0]}-${range[1]} / ${total} ảnh profile`;

  return (
    <BaseGallery
      open={open}
      onClose={onClose}
      mode={mode}
      onSelect={onSelect}
      selectedImages={selectedImages}
      category={MEDIA_CATEGORIES.PROFILE}
      images={images}
      loading={loading}
      totalImages={totalImages}
      currentPage={currentPage}
      pageSize={pageSize}
      searchText={searchText}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSearch={handleSearch}
      onSortChange={handleSortChange}
      onPageChange={handlePageChange}
      onImageSelect={handleImageSelect}
      onUpload={handleUpload}
      title={getTitle()}
      searchPlaceholder={getSearchPlaceholder()}
      uploadButtonText={getUploadButtonText()}
      infoText={getInfoText()}
      paginationText={getPaginationText}
    />
  );
};
