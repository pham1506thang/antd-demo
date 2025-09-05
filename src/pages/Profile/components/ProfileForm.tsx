import React from 'react';
import { Form, Input, Button, Space } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { authApi } from 'api/slices/authApi';
import type { User } from 'models/user';

interface ProfileFormProps {
  initialValues?: User;
  onCancel: () => void;
  onSuccess: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  initialValues,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [updateProfile] = authApi.useUpdateProfileMutation();

  const handleSubmit = async (values: Pick<User, 'name' | 'email'>) => {
    // Only update fields that have values (trimmed)
    const updateData: { name?: string; email?: string } = {};
    
    if (values.name !== undefined) {
      const trimmedName = values.name.trim();
      if (trimmedName !== '') {
        updateData.name = trimmedName;
      }
    }
    
    if (values.email !== undefined) {
      const trimmedEmail = values.email.trim();
      if (trimmedEmail !== '') {
        updateData.email = trimmedEmail;
      }
    }
    
    // Don't submit if no fields to update
    if (Object.keys(updateData).length === 0) {
      return;
    }
    
    try {
      await updateProfile(updateData).unwrap();
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
      <Form.Item name="name" label="Name">
        <Input placeholder="Enter name" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { type: 'email', message: 'Please enter a valid email!' },
        ]}
      >
        <Input placeholder="Enter email" />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
            Save Changes
          </Button>
          <Button onClick={onCancel} icon={<CloseOutlined />}>
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default ProfileForm;
