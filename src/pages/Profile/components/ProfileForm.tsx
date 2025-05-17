import React from 'react';
import { Form, Input, Button, Space } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { userApi } from '../../../api/slices/userApi';
import type { User } from '../../../models/user';
import type { Role } from '../../../models/role';

interface ProfileFormProps {
  initialValues?: User<Role>;
  onCancel: () => void;
  onSuccess: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  initialValues,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [updateUser] = userApi.useUpdateUserMutation();

  const handleSubmit = async (values: Pick<User<Role>, 'name' | 'email'>) => {
    if (!initialValues?._id) return;

    try {
      await updateUser({
        id: initialValues._id,
        user: {
          name: values.name,
          email: values.email,
        },
      }).unwrap();
      onSuccess();
    } catch (error) {
      // Error handling is done by the RTK Query middleware
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleSubmit}
    >
      <Form.Item
        name="name"
        label="Name"
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { type: 'email', message: 'Please enter a valid email!' },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
          >
            Save Changes
          </Button>
          <Button
            onClick={onCancel}
            icon={<CloseOutlined />}
          >
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default ProfileForm; 