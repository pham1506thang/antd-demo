import React from 'react';
import { Form, Row, Col, Input, Select, Button, Space } from 'antd';
import { SearchOutlined, UndoOutlined } from '@ant-design/icons';

const { Option } = Select;

const UserFilters: React.FC = () => {
  const [form] = Form.useForm();

  const handleReset = () => {
    form.resetFields();
  };

  return (
    <Form form={form} layout="vertical">
      <Space>
      <Form.Item name="search" label="Search">
            <Input
              placeholder="Search by name, email..."
              prefix={<SearchOutlined />}
            />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select placeholder="Select status">
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
              <Option value="blocked">Blocked</Option>
            </Select>
          </Form.Item>
          <Form.Item name="role" label="Role">
            <Select placeholder="Select role">
              <Option value="admin">Admin</Option>
              <Option value="user">User</Option>
              <Option value="manager">Manager</Option>
            </Select>
          </Form.Item>
          <Form.Item label=" ">
            <Space>
              <Button type="primary" icon={<SearchOutlined />}>
                Search
              </Button>
              <Button icon={<UndoOutlined />} onClick={handleReset}>
                Reset
              </Button>
            </Space>
          </Form.Item>
      </Space>
    </Form>
  );
};

export default UserFilters; 