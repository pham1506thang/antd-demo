import React, { useEffect, useRef } from 'react';
import { Table, Space, Button, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { User, UserStatus } from 'models/user';
import type { Role } from 'models/role';
import { userApi } from 'api/slices/userApi';
import { usePagination } from '@/hooks/usePagination';
import type { PaginationParams } from 'models/pagination';
import { convertFiltersToParams } from '@/api/apiHelper';
import type { FilterValues } from './UserFilters';
import { format } from 'date-fns';
import { TIME_FORMAT } from '@/models';
import { RoleTag } from '@/components/RoleTag';
import StatusTag from '@/components/StatusTag';

interface UsersListProps {
  filters: FilterValues;
}

const UsersList: React.FC<UsersListProps> = ({ filters }) => {
  const {
    tableParams,
    paginationParams,
    handleTableChange,
    setSearch,
  } = usePagination<User<Role>>({
    defaultSorts: [{ field: 'createdAt', order: 'descend' }],
    defaultFilters: [],
  });

  const prevSearchRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (filters.search !== prevSearchRef.current) {
      setSearch(filters.search || '');
      prevSearchRef.current = filters.search;
    }
  }, [filters.search, setSearch]);

  // Convert filter values to API params
  const apiFilters = convertFiltersToParams({
    status: filters.status,
    role: filters.role,
  });

  const queryParams: PaginationParams<User<Role>> = {
    ...paginationParams,
    filters: apiFilters,
  };

  const { data: usersData, isLoading, isFetching } = userApi.useGetUsersQuery(queryParams);

  const [deleteUser] = userApi.useDeleteUserMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id).unwrap();
      message.success('User deleted successfully');
    } catch (error) {
      message.error('Failed to delete user');
    }
  };

  const columns: ColumnsType<User<Role>> = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      sorter: true,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: true,
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: Role[]) => (
        <>
          {roles.map((role) => (
            <RoleTag key={role.id} role={role} />
          ))}
        </>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      render: (status: UserStatus) => (
        <StatusTag status={status} />
      ),
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      sorter: true,
      render: (date: string) => date ? format(date, TIME_FORMAT) : 'Never',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: User<Role>) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => console.log('Edit user:', record.id)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => record.id && handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={usersData?.data}
      rowKey="_id"
      loading={isLoading || isFetching}
      pagination={{
        ...tableParams.pagination,
        total: usersData?.meta.total,
        current: usersData?.meta.page,
        pageSize: usersData?.meta.limit,
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} users`,
      }}
      onChange={handleTableChange}
    />
  );
};

export default UsersList;