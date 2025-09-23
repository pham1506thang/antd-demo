import React, { useState, useEffect, useRef, useCallback } from 'react';
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
} from 'antd';
import {
  SearchOutlined,
  CheckOutlined,
  CloudUploadOutlined,
} from '@ant-design/icons';
import type { Media } from '@/models/media';
import { mediaApi } from '@/api/slices/mediaApi';
import { COLORS } from '@/constants/colors';

const { Search } = Input;
const { Text } = Typography;

export interface GalleryModalProps {
  open: boolean;
  onClose: () => void;
  mode: 'single' | 'multiple';
  onSelect: (images: Media[]) => void;
  selectedImages?: Media[];
  category?: 'general' | 'profile';
}

export const GalleryModal: React.FC<GalleryModalProps> = ({
  open,
  onClose,
  mode = 'single',
  onSelect,
  selectedImages = [],
  category = 'general',
}) => {
  const [images, setImages] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>(
    selectedImages.map(img => img.id)
  );
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadImages = useCallback(async (search?: string) => {
    setLoading(true);
    try {
      const result = await mediaApi.getImages({
        category,
        search,
        limit: 50,
      });
      setImages(result.data);
    } catch (error) {
      message.error('Không thể tải danh sách ảnh');
    } finally {
      setLoading(false);
    }
  }, [category]);

  // Load images when modal opens
  useEffect(() => {
    if (open) {
      loadImages();
    }
  }, [open, loadImages]);

  const handleSearch = (value: string) => {
    setSearchText(value);
    loadImages(value);
  };

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
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const newImage = await mediaApi.uploadImage(file);
      setImages(prev => [newImage, ...prev]);
      message.success('Upload ảnh thành công');
    } catch (error) {
      message.error('Upload ảnh thất bại');
    } finally {
      setUploading(false);
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
      handleUpload(file);
    }
  };

  const selectedCount = selectedImageIds.length;
  const maxSelection = mode === 'single' ? 1 : 10;

  return (
    <Modal
      title={
        <Space>
          <span>Chọn ảnh</span>
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
        {/* Search and Upload */}
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Search
              placeholder="Tìm kiếm ảnh..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={handleSearch}
              enterButton={<SearchOutlined />}
            />
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<CloudUploadOutlined />}
              onClick={handleUploadClick}
              loading={uploading}
            >
              Upload
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
                        src={image.thumbnailUrl}
                        alt={image.originalName}
                        style={{
                          width: '100%',
                          height: '150px',
                          objectFit: 'cover',
                          objectPosition: 'center',
                          display: 'block',
                          background: COLORS.GRAY_2,
                        }}
                        preview={false}
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
      </Space>
    </Modal>
  );
};