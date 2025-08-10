import React from 'react';
import { Tag, Space } from 'antd';
import { LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import type { Role } from 'models/role';

interface RoleTagProps {
  role: Role;
}

export const RoleTag: React.FC<RoleTagProps> = ({ role }) => {
  if (role.isAdmin) {
    return (
      <Tag color="blue">
        <Space size={4}>
          <SafetyCertificateOutlined />
          {role.label}
        </Space>
      </Tag>
    );
  }
  
  if (role.isProtected) {
    return (
      <Tag color="blue">
        <Space size={4}>
          <LockOutlined />
          {role.label}
        </Space>
      </Tag>
    );
  }

  return <Tag>{role.label}</Tag>;
};