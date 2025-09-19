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
}

const ErrorView: React.FC<ErrorViewProps> = ({
  message = 'Lỗi',
  description = 'Đã xảy ra lỗi. Vui lòng thử lại.',
  type = 'error',
  showBackButton = true,
  onBack,
  backButtonText = 'Quay lại'
}) => {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {showBackButton && onBack && (
        <div style={{ marginBottom: 16 }}>
          <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
            {backButtonText}
          </Button>
        </div>
      )}
      <Alert
        message={message}
        description={description}
        type={type}
        showIcon
      />
    </Space>
  );
};

export default ErrorView;
