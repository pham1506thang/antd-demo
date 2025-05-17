import React from 'react';
import { Table, Tag, Space, Button, message, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import type { User } from 'models/user';
import type { Role } from 'models/role';
import { userApi } from 'api/slices/userApi';
import { usePagination } from '@/hooks/usePagination';
import type { FilterValue } from 'antd/es/table/interface';
import debounce from 'lodash/debounce';

const { Search } = Input;

const UsersList: React.FC = () => {
  const {
    tableParams,
    paginationParams,
    handleTableChange,
    setSearch,
  } = usePagination<User<Role>>({
    defaultSorts: [{ field: 'createdAt', order: 'descend' }],
    defaultFilters: [],
  });

  const { data: usersData, isLoading, isFetching } = userApi.useGetUsersQuery(paginationParams, { skip: true });

  const [deleteUser] = userApi.useDeleteUserMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      message.success('User deleted successfully');
    } catch (error) {
      message.error('Failed to delete user');
    }
  };

  const handleSearch = debounce((value: string) => {
    setSearch(value);
  }, 500);

  const columns: ColumnsType<User<Role>> = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      sorter: true,
      filterIcon: <SearchOutlined />,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Search
            placeholder="Search username"
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onSearch={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              size="small"
              style={{ width: 90 }}
            >
              Filter
            </Button>
            <Button
              onClick={() => clearFilters?.()}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
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
      filters: [
        { text: 'Admin', value: 'admin' },
        { text: 'User', value: 'user' },
        { text: 'Manager', value: 'manager' },
      ],
      filterMode: 'tree',
      filterSearch: true,
      render: (roles: Role[]) => (
        <>
          {roles.map((role) => (
            <Tag color="blue" key={role._id}>
              {role.label}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      sorter: true,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => console.log('Edit user:', record._id)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id!)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search users"
          allowClear
          onChange={e => handleSearch(e.target.value)}
          style={{ width: 200 }}
        />
      </div>
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
    </div>
  );
};

export default UsersList; 