import React from 'react';
import { Form, Input, Button, Space } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { authApi } from '@/api/slices/authApi';

interface ChangePasswordFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

interface ChangePasswordValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [changePassword] = authApi.useChangePasswordMutation();

  const handleSubmit = async (values: ChangePasswordValues) => {
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }).unwrap();
      onSuccess();
    } catch (error) {
      // Handle error silently or add proper error handling
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item
        name="currentPassword"
        label="Mật khẩu hiện tại"
        rules={[
          { required: true, message: 'Please input your current password!' },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="newPassword"
        label="Mật khẩu mới"
        rules={[
          { required: true, message: 'Please input your new password!' },
          { min: 8, message: 'Password must be at least 8 characters!' },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label="Xác nhận mật khẩu"
        dependencies={['newPassword']}
        hasFeedback
        rules={[
          { required: true, message: 'Please confirm your password!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The passwords do not match!'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
            Change Password
          </Button>
          <Button onClick={onCancel} icon={<CloseOutlined />}>
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default ChangePasswordForm;
