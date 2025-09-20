import React from 'react';
import { Space, Button, Alert } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

interface ErrorViewProps {
  message?: string;
  description?: string;
  type?: 'error' | 'warning' | 'info';
  showBackButton?: boolean;
  onBack?: () => void;
  backButtonText?: string;
  status?: number;
}

const ErrorView: React.FC<ErrorViewProps> = ({
  message,
  description,
  type = 'error',
  showBackButton = true,
  onBack,
  backButtonText = 'Quay lại',
  status
}) => {
  // Determine message and description based on status
  const getErrorContent = () => {
    if (status === 404) {
      return {
        message: message || 'Không tìm thấy',
        description: description || 'Trang hoặc tài nguyên bạn đang tìm kiếm không tồn tại.'
      };
    }

    return {
      message: message || 'Lỗi',
      description: description || 'Đã xảy ra lỗi. Vui lòng thử lại.'
    };
  };

  const errorContent = getErrorContent();
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {showBackButton && onBack && (
        <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
          {backButtonText}
        </Button>
      )}
      <Alert
        message={errorContent.message}
        description={errorContent.description}
        type={type}
        showIcon
      />
    </Space>
  );
};

export default ErrorView;
