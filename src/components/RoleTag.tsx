import React from 'react';
import { Tag, Space } from 'antd';
import { LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import type { SummaryRole } from 'models/role';

interface RoleTagProps {
  role: SummaryRole;
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
