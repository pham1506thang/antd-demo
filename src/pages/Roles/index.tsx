import React, { useState } from 'react';
import { Card, Space, Button, Flex } from 'antd';
import { useNavigate } from 'react-router-dom';
import { RolesList } from './components/RolesList';
import { RoleStats } from './components/RoleStats';
import { RoleFilters, type FilterValues } from './components/RoleFilters';
import { RestrictedAction, TitleWithoutMargin } from '@/components';

export const RolesPage: React.FC = () => {
  const [filters, setFilters] = useState<FilterValues>({});
  const navigate = useNavigate();

  const handleCreateRole = () => {
    navigate('/roles/create');
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Flex
        justify="space-between"
        align="center"
      >
        <TitleWithoutMargin level={2}>
          Quản lý vai trò
        </TitleWithoutMargin>
        <RestrictedAction domain="ROLES" action="CREATE">
          <Button type="primary" onClick={handleCreateRole}>
            Tạo vai trò
          </Button>
        </RestrictedAction>
      </Flex>

      <RoleStats />

      <Card>
        <RoleFilters values={filters} onChange={setFilters} />
        <RolesList filters={filters} />
      </Card>
    </Space>
  );
};

