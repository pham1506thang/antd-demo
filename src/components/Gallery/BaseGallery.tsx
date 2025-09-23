/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react';
import {
  Modal,
  Row,
  Col,
  Input,
  Button,
  message,
  Spin,
  Image,
  Space,
  Tag,
  Typography,
  Select,
  Pagination,
} from 'antd';
import {
  SearchOutlined,
  CheckOutlined,
  CloudUploadOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import type { Media } from '@/models/media';
import { COLORS } from '@/constants/colors';
import { MEDIA_IMAGE_SIZES } from '@/constants/media';

const { Search } = Input;
const { Text } = Typography;

export interface BaseGalleryProps {
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

export const BaseGallery: React.FC<BaseGalleryProps> = ({
  open,
  onClose,
  mode = 'single',
  onSelect,
  selectedImages = [],
  category,
  images,
  loading,
  totalImages,
  currentPage,
  pageSize,
  searchText,
  sortBy,
  sortOrder,
  onSearch,
  onSortChange,
  onPageChange,
  onImageSelect,
  onUpload,
  title,
  searchPlaceholder,
  uploadButtonText,
  infoText,
  paginationText,
  generateThumbnailUrl,
  generateDisplayUrl,
}) => {
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>(
    selectedImages.map(img => img.id)
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (image: Media) => {
    if (mode === 'single') {
      setSelectedImageIds([image.id]);
    } else {
      setSelectedImageIds(prev => {
        if (prev.includes(image.id)) {
          return prev.filter(id => id !== image.id);
        } else {
          return [...prev, image.id];
        }
      });
    }
    onImageSelect(image);
  };

  const handleUpload = async (file: File) => {
    try {
      await onUpload(file);
      message.success('Upload ảnh thành công');
    } catch (error) {
      message.error('Upload ảnh thất bại');
    }
  };

  const handleConfirm = () => {
    const selectedImages = images.filter(img => selectedImageIds.includes(img.id));
    onSelect(selectedImages);
    onClose();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      event.target.value = '';
      handleUpload(file);
    }
  };

  const selectedCount = selectedImageIds.length;
  const maxSelection = mode === 'single' ? 1 : 10;
  const totalPages = Math.ceil(totalImages / pageSize);
  
  return (
    <Modal
      title={
        <Space>
          <span>{title}</span>
          {selectedCount > 0 && (
            <Tag color="blue">Đã chọn {selectedCount} ảnh</Tag>
          )}
        </Space>
      }
      open={open}
      onCancel={onClose}
      width="90vw"
      style={{ maxWidth: '1200px', maxHeight: '90vh' }}
      centered
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button
          key="confirm"
          type="primary"
          onClick={handleConfirm}
          disabled={selectedCount === 0}
        >
          Xác nhận ({selectedCount})
        </Button>,
      ]}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {/* Search, Filter and Upload */}
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Search
              placeholder={searchPlaceholder}
              value={searchText}
              onChange={(e) => onSearch(e.target.value)}
              onSearch={onSearch}
              enterButton={<SearchOutlined />}
            />
          </Col>
          <Col>
            <Select
              value={`${sortBy}_${sortOrder}`}
              onChange={onSortChange}
              style={{ width: 150 }}
              suffixIcon={<FilterOutlined />}
            >
              <Select.Option value="createdAt_DESC">Mới nhất</Select.Option>
              <Select.Option value="createdAt_ASC">Cũ nhất</Select.Option>
              <Select.Option value="originalName_ASC">Tên A-Z</Select.Option>
              <Select.Option value="originalName_DESC">Tên Z-A</Select.Option>
              <Select.Option value="size_DESC">Kích thước lớn</Select.Option>
              <Select.Option value="size_ASC">Kích thước nhỏ</Select.Option>
            </Select>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<CloudUploadOutlined />}
              onClick={handleUploadClick}
            >
              {uploadButtonText}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </Col>
        </Row>

        {/* Info Bar */}
        <Row justify="space-between" align="middle">
          <Col>
            <Text type="secondary">
              {infoText}
            </Text>
          </Col>
          <Col>
            <Text type="secondary">
              Trang {currentPage} / {totalPages}
            </Text>
          </Col>
        </Row>

        {/* Image Grid */}
        <div style={{
          height: '60vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          width: '100%'
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <Spin size="large" />
            </div>
          ) : (
            <Row gutter={[8, 8]}>
              {images.map((image) => {
                const isSelected = selectedImageIds.includes(image.id);
                const canSelect = mode === 'single' || selectedCount < maxSelection || isSelected;

                return (
                  <Col key={image.id} xs={8} sm={6} lg={4}>
                    <div
                      style={{
                        position: 'relative',
                        cursor: canSelect ? 'pointer' : 'not-allowed',
                        opacity: canSelect ? 1 : 0.5,
                        border: `2px solid ${isSelected ? COLORS.PRIMARY : COLORS.GRAY_3}`,
                        borderRadius: '8px',
                        overflow: 'hidden',
                        width: '100%',
                        maxWidth: '100%',
                      }}
                      onClick={() => canSelect && handleImageSelect(image)}
                    >
                      {/* Selection Overlay */}
                      {isSelected && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            zIndex: 2,
                            background: COLORS.PRIMARY,
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <CheckOutlined style={{ color: 'white', fontSize: '12px' }} />
                        </div>
                      )}

                      {/* Image */}
                      <Image
                        src={generateThumbnailUrl(image.id, image.category)}
                        alt={image.originalName}
                        style={{
                          width: '100%',
                          height: '150px',
                          objectFit: 'cover',
                          objectPosition: 'center',
                          display: 'block',
                          background: COLORS.GRAY_2,
                        }}
                        preview={{
                          src: generateDisplayUrl(image.id, image.category, MEDIA_IMAGE_SIZES.LARGE)
                        }}
                      />

                      {/* Image Info */}
                      <Text
                        style={{
                          padding: '4px 6px',
                          background: COLORS.GRAY_8,
                          color: 'white',
                          fontSize: '10px',
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {image.originalName}
                      </Text>
                    </div>
                  </Col>
                );
              })}
            </Row>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Row justify="center">
            <Col>
              <Pagination
                current={currentPage}
                total={totalImages}
                pageSize={pageSize}
                onChange={onPageChange}
                showSizeChanger={false}
                showQuickJumper
                showTotal={paginationText}
              />
            </Col>
          </Row>
        )}
      </Space>
    </Modal>
  );
};
