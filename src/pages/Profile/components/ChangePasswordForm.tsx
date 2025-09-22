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

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
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
          { required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="newPassword"
        label="Mật khẩu mới"
        rules={[
          { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
          { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' },
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
          { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
            Đổi mật khẩu
          </Button>
          <Button onClick={onCancel} icon={<CloseOutlined />}>
            Hủy
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

