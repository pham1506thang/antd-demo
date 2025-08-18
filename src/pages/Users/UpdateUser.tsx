import React from 'react';
import { Typography, Card, Space, message } from 'antd';
import { useParams } from 'react-router-dom';
import { userApi } from '@/api/slices/userApi';
import { useApiFormErrorHandler } from '@/hooks/useApiFormErrorHandler';
import UserForm from './components/UserForm';
import type { User } from '@/models/user';

// Get the props type from UserForm for type-safety
type UserFormSubmitPayload = React.ComponentProps<
  typeof UserForm<User>
>['onSubmit'];

const { Title } = Typography;

const UpdateUserPage: React.FC = () => {
  const { userId: id } = useParams<{ userId: string }>();

  // Queries
  const { data: user, isLoading: isUserLoading } = userApi.useGetUserQuery(
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

  const onFinish: UserFormSubmitPayload = async (payload) => {
    try {
      if (!id) {
        message.error('User ID not found!');
        return;
      }

      switch (payload.action) {
        case 'update-info': {
          await updateUser({
            id,
            name: payload.values.name,
            email: payload.values.email,
            avatarUrl: payload.values.avatarUrl,
            status: payload.values.status,
          }).unwrap();
          message.success('User information updated successfully!');
          break;
        }
        case 'change-password': {
          // Note: The API requires a different structure for change password.
          // We assume the DTO from the form matches the request.
          await changePassword({
            id,
            currentPassword: payload.values.currentPassword,
            newPassword: payload.values.newPassword,
          }).unwrap();
          message.success('Password changed successfully!');
          break;
        }
        case 'assign-role': {
          await assignUserRole({ id, roles: payload.values.roles }).unwrap();
          message.success('User roles updated successfully!');
          break;
        }
        default: {
          // This should not happen with the current form setup
          message.error('Invalid action!');
          break;
        }
      }
    } catch (error) {
      // The form instance is not available here, so we pass undefined.
      // The hook should be able to handle this gracefully.
      handleFormApiError(error, payload.form);
    }
  };

  if (isUserLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found.</div>;
  }

  const isLoading = isUpdatingInfo || isChangingPassword || isAssigningRole;

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}>Update User</Title>
      <Card>
        <UserForm<User>
          initialValues={user}
          onSubmit={onFinish}
          isLoading={isLoading}
        />
      </Card>
    </Space>
  );
};

export default UpdateUserPage;
