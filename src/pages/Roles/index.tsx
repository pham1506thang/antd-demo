import React, { useState } from 'react';
import { Typography, Card, Space, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import RolesList from './components/RolesList';
import RoleStats from './components/RoleStats';
import RoleFilters, { type FilterValues } from './components/RoleFilters';

const { Title } = Typography;

const RolesPage: React.FC = () => {
  const [filters, setFilters] = useState<FilterValues>({});
  const navigate = useNavigate();

  const handleCreateRole = () => {
    navigate('/roles/create');
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
          Roles Management
        </Title>
        <Button type="primary" onClick={handleCreateRole}>
          Create Role
        </Button>
      </div>

      <RoleStats />

      <Card>
        <RoleFilters values={filters} onChange={setFilters} />
        <RolesList filters={filters} />
      </Card>
    </Space>
  );
};

export default RolesPage;