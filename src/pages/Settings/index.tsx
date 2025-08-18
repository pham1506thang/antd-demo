import React from 'react';
import {
  Typography,
  Card,
  Form,
  Input,
  Switch,
  Select,
  Button,
  Space,
} from 'antd';
import { SettingOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const SettingsPage: React.FC = () => {
  const [form] = Form.useForm();

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}>
        <SettingOutlined /> Settings
      </Title>

      <Card title="General Settings">
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            siteName: 'My Admin Dashboard',
            language: 'en',
            darkMode: false,
            emailNotifications: true,
          }}
        >
          <Form.Item label="Site Name" name="siteName">
            <Input />
          </Form.Item>

          <Form.Item label="Language" name="language">
            <Select>
              <Option value="en">English</Option>
              <Option value="es">Spanish</Option>
              <Option value="fr">French</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Dark Mode" name="darkMode" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item
            label="Email Notifications"
            name="emailNotifications"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Button type="primary">Save Changes</Button>
          </Form.Item>
        </Form>
      </Card>
    </Space>
  );
};

export default SettingsPage;
