import React, { useEffect, useRef } from 'react';
import { Table, Tag, Space, Button, message } from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { TableProps } from 'antd';
import type { Role } from '@/models/role';
import type { PaginationParams } from '@/models/pagination';
import { useDeleteRoleMutation, useGetRolesQuery } from '@/api/slices/roleApi';
import { usePagination } from '@/hooks/usePagination';
import { convertFiltersToParams } from '@/api/apiHelper';
import { getRoleProtectionColor, getRoleProtectionText } from '@/helpers/role';
import type { FilterValues } from './RoleFilters';

interface RolesListProps {
  filters: FilterValues;
}

const RolesList: React.FC<RolesListProps> = ({ filters }) => {
  const navigate = useNavigate();
  const { tableParams, paginationParams, handleTableChange, setSearch } =
    usePagination<Role>({
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
    isProtected: filters.isProtected,
  });

  const queryParams: PaginationParams<Role> = {
    ...paginationParams,
    filters: apiFilters,
  };

  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useGetRolesQuery(queryParams);

  const [deleteRole] = useDeleteRoleMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteRole(id).unwrap();
      message.success('Xóa vai trò thành công');
    } catch (error) {
      message.error('Xóa vai trò thất bại');
    }
  };
  const columns: TableProps<Role>['columns'] = [
    {
      title: 'Mã',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Tên',
      dataIndex: 'label',
      key: 'label',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (description: string) => description || '-',
    },
    {
      title: 'Quản trị',
      dataIndex: 'isAdmin',
      key: 'isAdmin',
      render: (isAdmin: boolean) => (
        <Tag color={isAdmin ? 'blue' : 'default'}>
          {isAdmin ? 'Có' : 'Không'}
        </Tag>
      ),
    },
    {
      title: 'Bảo vệ',
      dataIndex: 'isProtected',
      key: 'isProtected',
      render: (isProtected: boolean) => (
        <Tag color={getRoleProtectionColor(isProtected)}>
          {getRoleProtectionText(isProtected)}
        </Tag>
      ),
    },
    {
      title: 'Quyền',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions: Role['permissions'], record: Role) => (
        <span>
          {record.isSuperAdmin ? 'Tất cả' : permissions.length}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record: Role) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/roles/${record.id}`)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate(`/roles/update/${record.id}`)}
            disabled={record.isProtected}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => record.id && handleDelete(record.id)}
            disabled={record.isProtected}
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
        dataSource={data?.data}
        loading={isLoading || isFetching}
        rowKey="id"
        pagination={{
          ...tableParams.pagination,
          total: data?.meta.total,
          current: data?.meta.page,
          pageSize: data?.meta.limit,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} vai trò`,
        }}
        onChange={handleTableChange}
        scroll={{ x: 'max-content' }}
      />
    </>
  );
};

export default RolesList;