import React from 'react';
import { Typography, Card, Space, message } from 'antd';
import { userApi } from '@/api/slices/userApi';
import { useApiFormErrorHandler } from '@/hooks/useApiFormErrorHandler';
import UserForm from './components/UserForm';
import type { CreateUserDTO } from '@/models';
import { useNavigate } from 'react-router-dom';

type UserFormProps = React.ComponentProps<typeof UserForm<undefined>>;

const { Title } = Typography;

const CreateUserPage: React.FC = () => {
  const navigate = useNavigate();
  const [createUser, { isLoading: isCreating }] =
    userApi.useCreateUserMutation();
  const { handleFormApiError } = useApiFormErrorHandler();

  const onFinish: UserFormProps['onSubmit'] = async ({ values, form }) => {
    try {
      const userData: CreateUserDTO = {
        username: values.username,
        name: values.name,
        email: values.email,
        password: values.password!,
        roles: values.roles,
      };

      await createUser(userData).unwrap();
      message.success('User created successfully');
      form.resetFields();
      navigate('/users');
    } catch (error) {
      handleFormApiError(error, form);
    }
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}>Create New User</Title>
      <Card>
        <UserForm onSubmit={onFinish} isLoading={isCreating} />
      </Card>
    </Space>
  );
};

export default CreateUserPage;
