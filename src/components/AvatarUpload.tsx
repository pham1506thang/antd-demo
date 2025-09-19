import React, { useState } from 'react';
import { Avatar, Upload, message } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile } from 'antd/es/upload/interface';
import {
  LoadingOutlined,
  UserOutlined,
  CameraOutlined,
} from '@ant-design/icons';
import { userApi } from 'api/slices/userApi';
import styled from 'styled-components';

interface AvatarUploadProps {
  avatarUrl?: string;
  size?: number;
}

const StyledUpload = styled(Upload)`
  &.avatar-uploader .ant-upload {
    width: auto !important;
    height: auto !important;
    background: none !important;
    border: none !important;
    margin: 0 !important;
  }

  &.avatar-uploader .ant-upload:hover {
    background: none !important;
  }
`;

const AvatarContainer = styled.div<{ size: number }>`
  position: relative;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  cursor: pointer;

  &:hover .overlay {
    opacity: 1;
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
`;

const AvatarUpload: React.FC<AvatarUploadProps> = ({ avatarUrl, size = 120 }) => {
  const [loading, setLoading] = useState(false);
  const [updateAvatar] = userApi.useUpdateAvatarMutation();

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG files!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Hình ảnh phải nhỏ hơn 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange = async (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }

    if (info.file.status === 'done') {
      try {
        await updateAvatar(info.file.response.url);
        message.success('Cập nhật ảnh đại diện thành công');
      } catch (error) {
        message.error('Failed to update avatar');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <StyledUpload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      action="/api/upload"
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      <AvatarContainer size={size}>
        <Avatar 
          size={size} 
          src={avatarUrl} 
          icon={loading ? <LoadingOutlined /> : <UserOutlined />}
        />
        <Overlay className="overlay">
          <CameraOutlined style={{ fontSize: Math.max(16, size * 0.2) }} />
          <div style={{ fontSize: Math.max(10, size * 0.1), marginTop: 4 }}>
            {avatarUrl ? 'Đổi ảnh' : 'Tải ảnh lên'}
          </div>
        </Overlay>
      </AvatarContainer>
    </StyledUpload>
  );
};

export default AvatarUpload;
