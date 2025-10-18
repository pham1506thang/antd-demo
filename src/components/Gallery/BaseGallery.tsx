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
} from 'antd';
import {
  SearchOutlined,
  CheckOutlined,
  CloudUploadOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import type { MediaImage } from '@/models/media';
import { COLORS } from '@/constants/colors';
import { getDisplayUrl, getImageUrl } from '@/helpers/media';
import { formatDateOnly } from '@/helpers/date';
import { IMAGE_SIZES, type MediaCategory } from '@/constants/media';

const { Search } = Input;
const { Text } = Typography;

export interface BaseGalleryProps {
  open: boolean;
  onClose: () => void;
  mode: 'single' | 'multiple';
  onSelect: (mediaItems: MediaImage[]) => void;
  selectedImages?: MediaImage[];
  category: MediaCategory;
  aspectRatio?: '1' | '3 / 2';
  // Data and loading states
  images: MediaImage[];
  loading: boolean;
  loadingMore?: boolean;
  hasNextPage?: boolean;
  // Search and sort states
  searchText: string;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
  // Event handlers
  onSearch: (value: string) => void;
  onSortChange: (value: string) => void;
  onImageSelect: (image: MediaImage) => void;
  onUpload: (file: File) => Promise<void>;
  // UI customization
  title: string;
  searchPlaceholder: string;
  uploadButtonText: string;
  infoText: string;
  // Infinite scroll props
  useInfiniteScroll?: boolean;
  loadMoreRef?: (node: HTMLElement | null) => void;
}

export const BaseGallery: React.FC<BaseGalleryProps> = ({
  open,
  onClose,
  mode = 'single',
  onSelect,
  selectedImages = [],
  images,
  aspectRatio = '1',
  loading,
  loadingMore = false,
  hasNextPage = false,
  searchText,
  sortBy,
  sortOrder,
  onSearch,
  onSortChange,
  onImageSelect,
  onUpload,
  title,
  searchPlaceholder,
  uploadButtonText,
  infoText,
  useInfiniteScroll = false,
  loadMoreRef,
}) => {
  const [selectedImageIds, setSelectedImageIds] = useState<Set<string>>(
    new Set(selectedImages.map(img => img.id))
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (image: MediaImage) => {
    if (mode === 'single') {
      setSelectedImageIds(prev => {
        if (prev.has(image.id)) {
          return new Set(); // Allow uncheck in single mode
        } else {
          return new Set([image.id]);
        }
      });
    } else {
      setSelectedImageIds(prev => {
        const newSet = new Set(prev);
        if (newSet.has(image.id)) {
          newSet.delete(image.id);
        } else {
          newSet.add(image.id);
        }
        return newSet;
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
    const selectedImages = images.filter(img => selectedImageIds.has(img.id));
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

  const selectedCount = selectedImageIds.size;
  const maxSelection = mode === 'single' ? 1 : 10;

  return (
    <Modal
      title={
        <Space>
          <span>{title}</span>
          {selectedCount > 0 && (
            <Tag color="blue" style={{ display: 'block' }}>Đã chọn {selectedCount} ảnh</Tag>
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
          {!useInfiniteScroll && (
            <Col>
              <Text type="secondary">
                Hiển thị {images.length} ảnh
              </Text>
            </Col>
          )}
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
            <>
              <Row gutter={[8, 8]}>
                {images.map((image) => {
                  const isSelected = selectedImageIds.has(image.id);
                  const canSelect = mode === 'single' || selectedCount < maxSelection || isSelected;

                  return (
                    <Col key={image.id} xs={8} sm={6} lg={4}>
                      <div
                        style={{
                          position: 'relative',
                          opacity: canSelect ? 1 : 0.5,
                          border: `2px solid ${isSelected ? COLORS.PRIMARY : COLORS.GRAY_3}`,
                          borderRadius: '8px',
                          overflow: 'hidden',
                          width: '100%',
                          maxWidth: '100%',
                        }}
                      >
                        {/* Checkbox - always visible */}
                        <div
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            zIndex: 2,
                            background: isSelected ? COLORS.PRIMARY : COLORS.GRAY_1,
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `2px solid ${isSelected ? COLORS.PRIMARY : COLORS.GRAY_5}`,
                            cursor: canSelect ? 'pointer' : 'not-allowed',
                          }}
                          onClick={() => canSelect && handleImageSelect(image)}
                        >
                          {isSelected && (
                            <CheckOutlined style={{ color: 'white', fontSize: '12px' }} />
                          )}
                        </div>
                        {/* Image Container with aspect ratio */}
                        <div
                          style={{
                            width: '100%',
                            aspectRatio,
                            overflow: 'hidden',
                            background: COLORS.GRAY_2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Image
                            src={getImageUrl(image.sizes, IMAGE_SIZES.SMALL) || ''}
                            alt={image.originalName}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              objectPosition: 'center',
                              display: 'block',
                            }}
                            wrapperStyle={{
                              width: '100%',
                              height: '100%',
                            }}
                            preview={{
                              src: getDisplayUrl(image.sizes) || ''
                            }}
                          />
                        </div>

                        {/* Image Info */}
                        <div
                          style={{
                            padding: '4px 6px',
                            background: COLORS.GRAY_8,
                            color: COLORS.GRAY_1,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: '10px',
                              display: 'block',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              color: COLORS.GRAY_1,
                            }}
                          >
                            {image.originalName}
                          </Text>
                          <Text
                            style={{
                              fontSize: '8px',
                              display: 'block',
                              color: COLORS.GRAY_4,
                            }}
                          >
                            {formatDateOnly(image.createdAt)}
                          </Text>
                        </div>
                      </div>
                    </Col>
                  );
                })}
              </Row>

              {/* Infinite Scroll Loading Indicator */}
              {useInfiniteScroll && (
                <div
                  ref={loadMoreRef}
                  style={{ 
                    textAlign: 'center', 
                    padding: '20px',
                    minHeight: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {loadingMore ? (
                    <div>
                      <Spin size="default" />
                      <div style={{ marginTop: '8px', color: COLORS.GRAY_6 }}>
                        Đang tải thêm...
                      </div>
                    </div>
                  ) : !hasNextPage && images.length > 0 ? (
                    <div style={{ color: COLORS.GRAY_6 }}>
                      Đã hiển thị tất cả ảnh
                    </div>
                  ) : null}
                </div>
              )}
            </>
          )}
        </div>

      </Space>
    </Modal>
  );
};
