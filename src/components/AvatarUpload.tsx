import React, { useState } from 'react';
import { Button, Avatar, Space, message } from 'antd';
import { UserOutlined, CameraOutlined } from '@ant-design/icons';
import { GalleryModal } from './Gallery';
import type { Media } from '@/models/media';

interface AvatarUploadProps {
  value?: string;
  onChange?: (value: string) => void;
  size?: number;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  value,
  onChange,
  size = 64,
}) => {
  const [galleryOpen, setGalleryOpen] = useState(false);

  const handleGallerySelect = (images: Media[]) => {
    if (images.length > 0) {
      onChange?.(images[0].url);
      message.success('Đã cập nhật avatar');
    }
    setGalleryOpen(false);
  };

  return (
    <Space direction="vertical" align="center">
      <Avatar
        size={size}
        src={value}
        icon={<UserOutlined />}
        style={{ cursor: 'pointer' }}
        onClick={() => setGalleryOpen(true)}
      />
      <Button
        icon={<CameraOutlined />}
        onClick={() => setGalleryOpen(true)}
        size="small"
      >
        Thay đổi avatar
      </Button>
      
      <GalleryModal
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        mode="single"
        onSelect={handleGallerySelect}
        category="profile"
      />
    </Space>
  );
};