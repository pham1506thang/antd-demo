import React from 'react';
import { Typography, Card, Space, message } from 'antd';
import { useParams } from 'react-router-dom';
import RoleForm from './components/RoleForm';
import { useGetRoleQuery, useUpdateRoleMutation } from '@/api/slices/roleApi';
import { useApiFormErrorHandler } from '@/hooks/useApiFormErrorHandler';
import type { Role } from '@/models/role';

// Get the props type from RoleForm for type-safety
type RoleFormSubmitPayload = React.ComponentProps<
  typeof RoleForm<Role>
>['onSubmit'];

const { Title } = Typography;

const UpdateRolePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Queries
  const { data: role, isLoading: isRoleLoading } = useGetRoleQuery(id!, {
    skip: !id,
  });

  // Mutations
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();

  const { handleFormApiError } = useApiFormErrorHandler();

  const onFinish: RoleFormSubmitPayload = async (payload) => {
    try {
      if (!id) {
        message.error('Không tìm thấy ID vai trò!');
        return;
      }

      await updateRole({
        id,
        label: payload.values.label,
        description: payload.values.description,
        permissions: payload.values.permissions,
      }).unwrap();
      message.success('Cập nhật vai trò thành công!');
    } catch (error) {
      handleFormApiError(error, payload.form);
    }
  };

  if (isRoleLoading) {
    return <div>Đang tải...</div>;
  }

  if (!role) {
    return <div>Không tìm thấy vai trò.</div>;
  }

  if (role.isProtected) {
    return (
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={2}>Cập nhật vai trò</Title>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Title level={4} type="warning">
              Vai trò này được bảo vệ và không thể chỉnh sửa
            </Title>
            <p>Các vai trò được bảo vệ là vai trò hệ thống không thể chỉnh sửa vì lý do bảo mật.</p>
          </div>
        </Card>
      </Space>
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}>Cập nhật vai trò</Title>
      <Card>
        <RoleForm<Role>
          initialValues={role}
          onSubmit={onFinish}
          isLoading={isUpdating}
        />
      </Card>
    </Space>
  );
};

export default UpdateRolePage;