import React, { useState } from 'react';
import { Table, Tag, Space, Button, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult, TableCurrentDataSource } from 'antd/es/table/interface';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { User } from '../../../models/user';
import type { Role } from '../../../models/role';
import { userApi } from '../../../api/slices/userApi';

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: 'ascend' | 'descend' | null;
  filters?: Record<string, FilterValue | null>;
}

const UsersList: React.FC = () => {
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const { data: usersData, isLoading, isFetching } = userApi.useGetUsersQuery({
    page: tableParams.pagination?.current,
    limit: tableParams.pagination?.pageSize,
    sort: tableParams.sortField,
    order: tableParams.sortOrder as 'ascend' | 'descend',
  });

  const [deleteUser] = userApi.useDeleteUserMutation();

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<User<Role>> | SorterResult<User<Role>>[],
    _: TableCurrentDataSource<User<Role>>
  ) => {
    setTableParams({
      pagination,
      filters,
      ...(!Array.isArray(sorter) && {
        sortField: sorter.field as string,
        sortOrder: sorter.order,
      }),
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
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
    },
    {
      title: 'Roles',
      dataIndex: 'roles',
      key: 'roles',
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
    <Table
      columns={columns}
      dataSource={usersData?.data}
      rowKey="_id"
      loading={isLoading || isFetching}
      pagination={{
        ...tableParams.pagination,
        total: usersData?.total,
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} users`,
      }}
      onChange={handleTableChange}
    />
  );
};

export default UsersList; 