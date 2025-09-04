import React, { useState, useMemo } from 'react';
import { Table, Input, Checkbox, Space, Tag } from 'antd';
import type { Key } from 'rc-table/lib/interface';
import type { Permission } from '@/models/permission';

const { Search } = Input;

interface PermissionAdvancedEditorProps {
  permissions: Permission[];
  selectedPermissions: string[];
  onPermissionChange: (permissionId: string, checked: boolean) => void;
}

const PermissionAdvancedEditor: React.FC<PermissionAdvancedEditorProps> = ({
  permissions,
  selectedPermissions,
  onPermissionChange,
}) => {
  const [searchText, setSearchText] = useState('');

  const filteredPermissions = useMemo(() => {
    if (!searchText) return permissions || [];
    
    return permissions?.filter(permission => 
      permission.domain.toLowerCase().includes(searchText.toLowerCase()) ||
      permission.action.toLowerCase().includes(searchText.toLowerCase())
    ) || [];
  }, [permissions, searchText]);

  const domainFilters = useMemo(() => {
    const domains = [...new Set(permissions?.map(p => p.domain) || [])];
    return domains.map(domain => ({
      text: domain,
      value: domain,
    }));
  }, [permissions]);

  const columns = [
    {
      title: 'Domain',
      dataIndex: 'domain',
      key: 'domain',
      sorter: (a: Permission, b: Permission) => a.domain.localeCompare(b.domain),
      filters: domainFilters,
      onFilter: (value: boolean | Key, record: Permission) => record.domain === value,
      render: (domain: string) => (
        <Tag color="blue">{domain}</Tag>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      sorter: (a: Permission, b: Permission) => a.action.localeCompare(b.action),
      render: (action: string) => (
        <Tag color="green">
          {action.replace(/_/g, ' ').toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Selected',
      dataIndex: 'id',
      key: 'selected',
      width: 100,
      render: (id: string) => (
        <Checkbox
          checked={selectedPermissions.includes(id)}
          onChange={(e) => onPermissionChange(id, e.target.checked)}
        />
      ),
    },
  ];

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Search
        placeholder="Search permissions by domain or action..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 16 }}
        allowClear
      />
      
      <Table
        dataSource={filteredPermissions}
        columns={columns}
        rowKey="id"
        pagination={{ 
          pageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} permissions`,
        }}
        size="small"
        scroll={{ y: 400 }}
        style={{ marginTop: 16 }}
      />
    </Space>
  );
};

export default PermissionAdvancedEditor;
