import React, { useEffect, useRef } from 'react';
import { Table, Space, Button, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons';
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
import { useNavigate } from 'react-router-dom';
import StatusTag from '@/components/StatusTag';
import { DOMAINS } from '@/models/permission';

interface UsersListProps {
  filters: FilterValues;
}

const UsersList: React.FC<UsersListProps> = ({ filters }) => {
  const navigate = useNavigate();
  const { tableParams, paginationParams, handleTableChange, setSearch } =
    usePagination<User>({
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
    roles: filters.roles,
  });

  const queryParams: PaginationParams<User> = {
    ...paginationParams,
    filters: apiFilters,
  };

  const {
    data: usersData,
    isLoading,
    isFetching,
    refetch,
  } = userApi.useGetUsersQuery(queryParams);

  const [deleteUser] = userApi.useDeleteUserMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id).unwrap();
      message.success('Xóa người dùng thành công');
    } catch (error) {
      message.error('Xóa người dùng thất bại');
    }
  };

  const columns: ColumnsType<User> = [
    {
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      key: 'username',
      sorter: true,
    },
    {
      title: 'Họ và tên',
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
      title: 'Vai trò',
      dataIndex: 'roles',
      key: 'roles',
      width: 200,
      render: (roles: Role[]) => (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 4,
          }}
        >
          {roles.map((role) => (
            <RoleTag key={role.id} role={role} />
          ))}
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      sorter: true,
      render: (status: UserStatus) => <StatusTag status={status} />,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      render: (date: string) => (date ? format(date, TIME_FORMAT) : ''),
    },
    {
      title: 'Lần đăng nhập cuối',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      sorter: true,
      render: (date: string) => (date ? format(date, TIME_FORMAT) : 'Chưa đăng nhập'),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record: User) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/${DOMAINS.USERS.value}/${record.id}`)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate(`/${DOMAINS.USERS.value}/update/${record.id}`)}
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
    <>
      <Button
        icon={<ReloadOutlined />}
        type="primary"
        onClick={refetch}
        loading={isFetching}
        style={{ marginBottom: 24 }}
      >
Làm mới danh sách
      </Button>
      <Table
        columns={columns}
        dataSource={usersData?.data}
        rowKey="id"
        loading={isLoading || isFetching}
        pagination={{
          ...tableParams.pagination,
          total: usersData?.meta.total,
          current: usersData?.meta.page,
          pageSize: usersData?.meta.limit,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} người dùng`,
        }}
        onChange={handleTableChange}
        scroll={{ x: 'max-content' }}
      />
    </>
  );
};

export default UsersList;
