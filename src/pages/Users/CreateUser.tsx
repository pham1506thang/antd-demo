import React from 'react';
import { Space, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserFormLayout, type UserFormPayload } from './components';
import { USER_FORM_ACTIONS } from './constants';
import { userApi } from '@/api/slices/userApi';
import { DOMAINS } from '@/models/permission';
import { TitleWithoutMargin } from '@/components';
import { useApiFormErrorHandler } from '@/hooks/useApiFormErrorHandler';

export const CreateUserPage: React.FC = () => {
  const navigate = useNavigate();

  const [createUser, { isLoading: isCreating }] = userApi.useCreateUserMutation();
  const { handleFormApiError } = useApiFormErrorHandler();

  const handleSubmit = async ({ action, values, form }: UserFormPayload) => {
    try {
      if (action !== USER_FORM_ACTIONS.CREATE) {
        message.error('Hành động không hợp lệ');
        return;
      }

      const userData = values;

      await createUser(userData).unwrap();
      message.success('Tạo người dùng thành công');
      navigate(`/${DOMAINS.USERS.value}`);
      form.resetFields();
    } catch (error) {
      console.log('error', error);
      handleFormApiError(error, form);
    }
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <TitleWithoutMargin level={2}>Tạo người dùng mới</TitleWithoutMargin>
      <UserFormLayout
        onSubmit={handleSubmit}
        isLoading={isCreating}
      />
    </Space>
  );
};

