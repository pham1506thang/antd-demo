import React, { useState } from 'react';
import { Typography, Card, Space, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import UsersList from './components/UsersList';
import UserStats from './components/UserStats';
import UserFilters, { type FilterValues } from './components/UserFilters';

const { Title } = Typography;

const UsersPage: React.FC = () => {
  const [filters, setFilters] = useState<FilterValues>({});
  const navigate = useNavigate();

  const handleCreateUser = () => {
    navigate('/users/create');
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          Users Management
        </Title>
        <Button type="primary" onClick={handleCreateUser}>
          Create User
        </Button>
      </div>

      <UserStats />

      <Card>
        <UserFilters values={filters} onChange={setFilters} />
        <UsersList filters={filters} />
      </Card>
    </Space>
  );
};

export default UsersPage;
