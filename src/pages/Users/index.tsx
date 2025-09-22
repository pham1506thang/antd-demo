import React, { useState } from 'react';
import { Card, Space, Button, Flex } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UsersList, UserStats, UserFilters, type FilterValues } from './components';
import { DOMAINS } from '@/models/permission';
import { RestrictedAction, TitleWithoutMargin } from '@/components';

export const UsersPage: React.FC = () => {
  const [filters, setFilters] = useState<FilterValues>({});
  const navigate = useNavigate();

  const handleCreateUser = () => {
    navigate(`/${DOMAINS.USERS.value}/create`);
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Flex
        justify="space-between"
        align="center"
      >
        <TitleWithoutMargin level={2}>
          Quản lý người dùng
        </TitleWithoutMargin>
        <RestrictedAction domain="USERS" action="CREATE">
          <Button type="primary" onClick={handleCreateUser}>
            Tạo người dùng
          </Button>
        </RestrictedAction>
      </Flex>

      <UserStats />

      <Card>
        <UserFilters values={filters} onChange={setFilters} />
        <UsersList filters={filters} />
      </Card>
    </Space>
  );
};

