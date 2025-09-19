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
        <SettingOutlined /> Cài đặt
      </Title>

      <Card title="Cài đặt chung">
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            siteName: 'Bảng điều khiển quản trị',
            language: 'en',
            darkMode: false,
            emailNotifications: true,
          }}
        >
          <Form.Item label="Tên trang web" name="siteName">
            <Input />
          </Form.Item>

          <Form.Item label="Ngôn ngữ" name="language">
            <Select>
              <Option value="en">Tiếng Anh</Option>
              <Option value="es">Tiếng Tây Ban Nha</Option>
              <Option value="fr">Tiếng Pháp</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Chế độ tối" name="darkMode" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item
            label="Thông báo email"
            name="emailNotifications"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Button type="primary">Lưu thay đổi</Button>
          </Form.Item>
        </Form>
      </Card>
    </Space>
  );
};

export default SettingsPage;
