import React, { useState } from 'react';
import { Typography, Card, Space } from 'antd';
import UsersList from './components/UsersList';
import UserStats from './components/UserStats';
import UserFilters, { type FilterValues } from './components/UserFilters';

const { Title } = Typography;

const UsersPage: React.FC = () => {
  const [filters, setFilters] = useState<FilterValues>({});

  const handleFiltersChange = (_: any, allValues: FilterValues) => {
    setFilters(allValues);
  };

  const handleSearch = (values: FilterValues) => {
    setFilters(values);
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}>Users Management</Title>
      
      <UserStats />
      
      <Card>
        <UserFilters 
          values={filters}
          onChange={handleFiltersChange}
          onSearch={handleSearch}
        />
        <UsersList filters={filters} />
      </Card>
    </Space>
  );
};

export default UsersPage;