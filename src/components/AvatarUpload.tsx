import React, { useState } from 'react';
import { Button, Avatar, Space, message } from 'antd';
import { UserOutlined, CameraOutlined } from '@ant-design/icons';
import { ProfileGallery } from './Gallery';
import type { MediaImage } from '@/models/media';

interface AvatarUploadProps {
  defaultAvatar?: string;
  draftAvatar?: string;
  size?: number;
  onMediaChange?: (media: MediaImage) => void;
  onClear?: () => void;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  defaultAvatar,
  draftAvatar,
  size = 128,
  onMediaChange,
  onClear,
}) => {
  const [galleryOpen, setGalleryOpen] = useState(false);

  const handleGallerySelect = (images: MediaImage[]) => {
    if (images.length > 0) {
      const selectedImage = images[0];
      
      // Call onMediaChange with full media object
      onMediaChange?.(selectedImage);
    }
    setGalleryOpen(false);
  };

  return (
    <Space direction="vertical" align="center">
      <div style={{ position: 'relative' }}>
        <Avatar
          size={size}
          src={draftAvatar || defaultAvatar}
          icon={<UserOutlined />}
          style={{ cursor: 'pointer' }}
          onClick={() => setGalleryOpen(true)}
        />
        
      </div>
      
      <Button
        icon={<CameraOutlined />}
        onClick={draftAvatar ? onClear : () => setGalleryOpen(true)}
        size="small"
        type={draftAvatar ? 'default' : 'primary'}
      >
        {draftAvatar ? 'Xoá' : 'Chọn avatar'}
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