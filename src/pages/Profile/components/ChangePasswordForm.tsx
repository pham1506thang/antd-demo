import React from 'react';
import { Form, Input, Button, message, Flex } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { authApi } from '@/api/slices/authApi';
import { useApiFormErrorHandler } from '@/hooks';

interface ChangePasswordFormProps {
}

interface ChangePasswordValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = () => {
  const [form] = Form.useForm();
  const [changePassword] = authApi.useChangePasswordMutation();
  const { handleFormApiError } = useApiFormErrorHandler();

  const handleSubmit = async (values: ChangePasswordValues) => {
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }).unwrap();
      form.resetFields();
      message.success('Đổi mật khẩu thành công');
    } catch (error) {
      handleFormApiError(error, form);
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
        <Flex justify="end">
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
            Đổi mật khẩu
          </Button>
        </Flex>
      </Form.Item>
    </Form>
  );
};

