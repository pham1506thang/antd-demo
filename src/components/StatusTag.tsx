import React from 'react';
import { Tag } from 'antd';
import { type UserStatus } from '@/models';
import { getUserStatusColor, getUserStatusText } from '@/helpers/user';

interface StatusTagProps {
  status: UserStatus;
}

export const StatusTag: React.FC<StatusTagProps> = ({ status }) => {
  return (
    <Tag color={getUserStatusColor(status)}>{getUserStatusText(status)}</Tag>
  );
};
