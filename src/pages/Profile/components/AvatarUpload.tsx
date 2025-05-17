import React, { useState } from 'react';
import { Upload, message } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile } from 'antd/es/upload/interface';
import { LoadingOutlined, UserOutlined, CameraOutlined } from '@ant-design/icons';
import { userApi } from '../../../api/slices/userApi';
import './AvatarUpload.css';

interface AvatarUploadProps {
  avatarUrl?: string;
}

const styles = {
  placeholder: {
    width: 120,
    height: 120,
    borderRadius: '50%',
    backgroundColor: '#fafafa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column' as const,
    cursor: 'pointer',
    border: '1px dashed #d9d9d9',
  },
  icon: {
    fontSize: 32,
    color: '#999',
  },
  uploadText: {
    marginTop: 8,
    color: '#666',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  },
};

const AvatarUpload: React.FC<AvatarUploadProps> = ({ avatarUrl }) => {
  const [loading, setLoading] = useState(false);
  const [updateAvatar] = userApi.useUpdateAvatarMutation();

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG files!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
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
        message.success('Avatar updated successfully');
      } catch (error) {
        message.error('Failed to update avatar');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Upload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      action="/api/upload"
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {avatarUrl ? (
        <div className="avatar-container">
          <img
            src={avatarUrl}
            alt="avatar"
            style={styles.image}
          />
          <div className="overlay">
            <CameraOutlined style={{ color: 'white', fontSize: 24 }} />
            <div style={{ color: 'white', marginTop: 4, fontSize: 12 }}>
              Change Photo
            </div>
          </div>
        </div>
      ) : (
        <div style={styles.placeholder}>
          {loading ? (
            <LoadingOutlined style={styles.icon} />
          ) : (
            <>
              <UserOutlined style={styles.icon} />
              <div style={styles.uploadText}>Upload</div>
            </>
          )}
        </div>
      )}
    </Upload>
  );
};

export default AvatarUpload; 