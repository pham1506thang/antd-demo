import React, { useState } from 'react';
import { Button, Avatar, Space, message } from 'antd';
import { UserOutlined, CameraOutlined } from '@ant-design/icons';
import { ProfileGallery } from './Gallery';
import type { MediaImage } from '@/models/media';
import { getThumbnailUrl } from '@/helpers/media';

interface AvatarUploadProps {
  value?: string;
  onChange?: (value: string) => void;
  size?: number;
  // New fields for enhanced functionality
  altText?: string;
  description?: string;
  isPublic?: boolean;
  onMediaChange?: (media: MediaImage) => void; // Callback with full media object
  // Media object for processing status
  media?: MediaImage;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  value: _value,
  onChange,
  size = 64,
  altText, // Future enhancement: can be used for alt text in upload
  description, // Future enhancement: can be used for description in upload
  isPublic = false, // Future enhancement: can be used for privacy setting in upload
  onMediaChange,
  media: _media,
}) => {
  const [galleryOpen, setGalleryOpen] = useState(false);

  const handleGallerySelect = (images: MediaImage[]) => {
    if (images.length > 0) {
      const selectedImage = images[0];
      
      // Get thumbnail URL from sizes array
      const thumbnailUrl = getThumbnailUrl(selectedImage.sizes);
      if (thumbnailUrl) {
        onChange?.(thumbnailUrl);
        message.success('Đã cập nhật avatar');
      } else {
        message.error('Không thể lấy URL ảnh avatar');
      }
      
      // Call onMediaChange with full media object for advanced usage
      onMediaChange?.(selectedImage);
    }
    setGalleryOpen(false);
  };

  return (
    <Space direction="vertical" align="center">
      <div style={{ position: 'relative' }}>
        <Avatar
          size={size}
          src={_value}
          icon={<UserOutlined />}
          style={{ cursor: 'pointer' }}
          onClick={() => setGalleryOpen(true)}
        />
        
      </div>
      
      <Button
        icon={<CameraOutlined />}
        onClick={() => setGalleryOpen(true)}
        size="small"
      >
        Thay đổi avatar
      </Button>
      
      <ProfileGallery
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        mode="single"
        onSelect={handleGallerySelect}
      />
    </Space>
  );
};