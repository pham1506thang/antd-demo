import React from 'react';
import { Typography, Card, Space } from 'antd';
import UsersList from './components/UsersList';
import UserStats from './components/UserStats';
import UserFilters from './components/UserFilters';

const { Title } = Typography;

const UsersPage: React.FC = () => {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}>Users Management</Title>
      
      <UserStats />
      
      <Card>
      <UserFilters />
        <UsersList />
      </Card>
    </Space>
  );
};

export default UsersPage; 