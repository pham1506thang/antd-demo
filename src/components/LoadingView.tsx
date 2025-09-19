import React from 'react';
import { Spin } from 'antd';

interface LoadingViewProps {
  message?: string;
  size?: 'small' | 'default' | 'large';
}

const LoadingView: React.FC<LoadingViewProps> = ({ 
  message = 'Đang tải...', 
  size = 'large' 
}) => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <Spin size={size} />
      <div style={{ marginTop: 16 }}>{message}</div>
    </div>
  );
};

export default LoadingView;
