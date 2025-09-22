import React from 'react';
import { Space, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { RoleFormLayout, type RoleFormPayload } from './components/RoleFormLayout';
import { ROLE_FORM_ACTIONS } from './constants';
import { useAssignPermissionsMutation, useGetRoleQuery, useUpdateRoleMutation } from '@/api/slices/roleApi';
import { useApiFormErrorHandler } from '@/hooks/useApiFormErrorHandler';
import { isApiError } from '@/models/error';
import { DOMAINS } from '@/models/permission';
import { LoadingView, ErrorView, TitleWithoutMargin } from '@/components';

export const EditRolePage: React.FC = () => {
  const { roleId: id } = useParams<{ roleId: string }>();
  const navigate = useNavigate();

  const { data: role, isLoading: isRoleLoading, error } = useGetRoleQuery(id!, {
    skip: !id,
  });

  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  const [assignPermissions, { isLoading: isAssigningPermissions }] = useAssignPermissionsMutation();

  const { handleFormApiError } = useApiFormErrorHandler();

  const handleBack = () => {
    navigate(`/${DOMAINS.ROLES.value}`);
  };

  const handleSubmit = async ({ action, values, form }: RoleFormPayload) => {
    try {
      if (!id) {
        message.error('Không tìm thấy ID vai trò!');
        return;
      }

      let actionMessage = '';
      switch (action) {
        case ROLE_FORM_ACTIONS.UPDATE_INFO: {
          await updateRole({
            id,
            ...values,
          }).unwrap();
          actionMessage = 'Cập nhật thông tin vai trò thành công!';
          break;
        }
        case ROLE_FORM_ACTIONS.UPDATE_PERMISSIONS: {
          await assignPermissions({
            id,
            ...values,
          }).unwrap();
          actionMessage = 'Cập nhật quyền vai trò thành công!';
          break;
        }
        default: {
          message.error('Hành động không hợp lệ!');
          break;
        }
      }
      message.success(actionMessage);
    } catch (error) {
      handleFormApiError(error, form);
    }
  };

  if (isRoleLoading) {
    return <LoadingView message="Đang tải thông tin vai trò..." />;
  }

  if (error || !role) {
    const statusCode = error && isApiError(error) ? error.statusCode : 404;

    return (
      <ErrorView
        status={statusCode}
        onBack={handleBack}
        backButtonText="Quay lại danh sách"
      />
    );
  }

  // if (role.isProtected) {
  //   return (
  //     <Space direction="vertical" size="large" style={{ width: '100%' }}>
  //       <Title level={2}>Cập nhật vai trò</Title>
  //       <Card>
  //         <div style={{ textAlign: 'center', padding: '40px' }}>
  //           <Title level={4} type="warning">
  //             Vai trò này được bảo vệ và không thể chỉnh sửa
  //           </Title>
  //           <p>Các vai trò được bảo vệ là vai trò hệ thống không thể chỉnh sửa vì lý do bảo mật.</p>
  //         </div>
  //       </Card>
  //     </Space>
  //   );
  // }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <TitleWithoutMargin level={2}>Chỉnh sửa vai trò</TitleWithoutMargin>
      <RoleFormLayout
        initialValues={role}
        onSubmit={handleSubmit}
        isLoading={isUpdating || isAssigningPermissions}
      />
    </Space>
  );
};
