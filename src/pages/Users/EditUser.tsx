import React from 'react';
import { Space, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { userApi } from '@/api/slices/userApi';
import { useApiFormErrorHandler } from '@/hooks/useApiFormErrorHandler';
import { isApiError } from '@/models/error';
import { DOMAINS } from '@/models/permission';
import { LoadingView, ErrorView, TitleWithoutMargin } from '@/components';
import { UserFormLayout, type UserFormPayload } from './components';
import { USER_FORM_ACTIONS } from './constants';

export const EditUserPage: React.FC = () => {
  const { userId: id } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  // Queries
  const { data: user, isLoading: isUserLoading, error } = userApi.useGetUserQuery(
    id!,
    {
      skip: !id,
    }
  );

  // Mutations
  const [updateUser, { isLoading: isUpdatingInfo }] =
    userApi.useUpdateUserMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    userApi.useChangePasswordMutation();
  const [assignUserRole, { isLoading: isAssigningRole }] =
    userApi.useAssignUserRoleMutation();

  const { handleFormApiError } = useApiFormErrorHandler();

  const handleBack = () => {
    navigate(`/${DOMAINS.USERS.value}`);
  };

  const handleSubmit = async ({ action, values, form }: UserFormPayload) => {
    try {
      if (!id) {
        message.error('Không tìm thấy ID người dùng!');
        return;
      }

      switch (action) {
        case USER_FORM_ACTIONS.UPDATE_INFO: {
          await updateUser({
            id,
            ...values,
          }).unwrap();
          message.success('Cập nhật thông tin người dùng thành công!');
          break;
        }
        case USER_FORM_ACTIONS.CHANGE_PASSWORD: {
          await changePassword({
            id,
            ...values,
          }).unwrap();
          message.success('Đổi mật khẩu thành công!');
          form.setFieldsValue({
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
          });
          break;
        }
        case USER_FORM_ACTIONS.ASSIGN_ROLE: {
          await assignUserRole({ id, ...values }).unwrap();
          message.success('Cập nhật vai trò người dùng thành công!');
          break;
        }
        default: {
          message.error('Hành động không hợp lệ!');
          break;
        }
      }
    } catch (error) {
      handleFormApiError(error, form);
    }
  };

  if (isUserLoading) {
    return <LoadingView message="Đang tải thông tin người dùng..." />;
  }

  if (error || !user) {
    const statusCode = error && isApiError(error) ? error.statusCode : 404;

    return (
      <ErrorView
        status={statusCode}
        onBack={handleBack}
        backButtonText="Quay lại danh sách"
      />
    );
  }

  const isLoading = isUpdatingInfo || isChangingPassword || isAssigningRole;

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <TitleWithoutMargin level={2}>Chỉnh sửa người dùng</TitleWithoutMargin>
      <UserFormLayout
        initialValues={user}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </Space>
  );
};
