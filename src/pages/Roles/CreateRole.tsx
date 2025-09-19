import React from 'react';
import { Typography, Card, Space, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import RoleForm from './components/RoleForm';
import { useCreateRoleMutation } from '@/api/slices/roleApi';
import { useApiFormErrorHandler } from '@/hooks/useApiFormErrorHandler';
import type { CreateRoleDTO } from '@/models/dto/role';

type RoleFormProps = React.ComponentProps<typeof RoleForm<undefined>>;

const { Title } = Typography;

const CreateRolePage: React.FC = () => {
  const navigate = useNavigate();
  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const { handleFormApiError } = useApiFormErrorHandler();

  const onFinish: RoleFormProps['onSubmit'] = async ({ values, form }) => {
    try {
      const roleData: CreateRoleDTO = {
        code: values.code,
        label: values.label,
        description: values.description,
        permissions: values.permissions,
      };

      await createRole(roleData).unwrap();
      message.success('Tạo vai trò thành công');
      form.resetFields();
      navigate('/roles');
    } catch (error) {
      handleFormApiError(error, form);
    }
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}>Tạo vai trò mới</Title>
      <Card>
        <RoleForm onSubmit={onFinish} isLoading={isCreating} />
      </Card>
    </Space>
  );
};

export default CreateRolePage;