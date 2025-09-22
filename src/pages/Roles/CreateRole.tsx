import React from 'react';
import { Space, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { RoleFormLayout, type RoleFormPayload } from './components/RoleFormLayout';
import { ROLE_FORM_ACTIONS } from './constants';
import { useCreateRoleMutation } from '@/api/slices/roleApi';
import { TitleWithoutMargin } from '@/components';
import { useApiFormErrorHandler } from '@/hooks/useApiFormErrorHandler';

export const CreateRolePage: React.FC = () => {
  const navigate = useNavigate();

  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const { handleFormApiError } = useApiFormErrorHandler();

  const handleSubmit = async ({ action, values, form }: RoleFormPayload) => {
    try {
      if (action !== ROLE_FORM_ACTIONS.CREATE) {
        message.error('Hành động không hợp lệ');
        return;
      }

      const roleData = values;

      await createRole(roleData).unwrap();
      message.success('Tạo vai trò thành công');
      navigate('/roles');
      form.resetFields();
    } catch (error) {
      handleFormApiError(error, form);
    }
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <TitleWithoutMargin level={2}>Tạo vai trò mới</TitleWithoutMargin>
      <RoleFormLayout
        onSubmit={handleSubmit}
        isLoading={isCreating}
      />
    </Space>
  );
};

