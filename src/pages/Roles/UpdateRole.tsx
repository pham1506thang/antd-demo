import React from 'react';
import { Typography, Card, Space, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import RoleForm from './components/RoleForm';
import { useGetRoleQuery, useUpdateRoleMutation } from '@/api/slices/roleApi';
import { useApiFormErrorHandler } from '@/hooks/useApiFormErrorHandler';
import { isApiError } from '@/models/error';
import { DOMAINS } from '@/models/permission';
import LoadingView from '@/components/LoadingView';
import ErrorView from '@/components/ErrorView';
import type { Role } from '@/models/role';

// Get the props type from RoleForm for type-safety
type RoleFormSubmitPayload = React.ComponentProps<
  typeof RoleForm<Role>
>['onSubmit'];

const { Title } = Typography;

const UpdateRolePage: React.FC = () => {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();

  // Queries
  const { data: role, isLoading: isRoleLoading, error } = useGetRoleQuery(roleId!, {
    skip: !roleId,
  });

  // Mutations
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();

  const { handleFormApiError } = useApiFormErrorHandler();

  const handleBack = () => {
    navigate(`/${DOMAINS.ROLES.value}`);
  };

  const onFinish: RoleFormSubmitPayload = async (payload) => {
    try {
      if (!roleId) {
        message.error('Không tìm thấy ID vai trò!');
        return;
      }

      await updateRole({
        id: roleId,
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
    return <LoadingView message="Đang tải thông tin vai trò..." />;
  }

  if (error || !role) {
    // Extract status code from error, default to 404 if no role data
    const statusCode = error && isApiError(error) ? error.statusCode : 404;
    
    return (
      <ErrorView
        status={statusCode}
        onBack={handleBack}
        backButtonText="Quay lại danh sách"
      />
    );
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