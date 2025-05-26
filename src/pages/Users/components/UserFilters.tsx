import React from 'react';
import { Form, Input, Select, Button, Space } from 'antd';
import { SearchOutlined, UndoOutlined } from '@ant-design/icons';

const { Option } = Select;

export interface FilterValues {
  search?: string;
  status?: string[];
  role?: string[];
}

interface UserFiltersProps {
  values: FilterValues;
  onChange: (changedValues: any, allValues: FilterValues) => void;
  onSearch: (values: FilterValues) => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({ values, onChange, onSearch }) => {
  const [form] = Form.useForm();

  const handleReset = () => {
    form.resetFields();
    onSearch({});
  };

  const handleFinish = (values: FilterValues) => {
    onSearch(values);
  };

  return (
    <Form 
      form={form} 
      layout="vertical"
      initialValues={values}
      onValuesChange={onChange}
      onFinish={handleFinish}
    >
      <Space>
        <Form.Item name="search" label="Search">
          <Input
            placeholder="Search by name, email..."
            prefix={<SearchOutlined />}
          />
        </Form.Item>
        <Form.Item name="status" label="Status">
          <Select 
            mode="multiple"
            placeholder="Select status" 
            allowClear
            style={{ minWidth: 200 }}
          >
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
            <Option value="blocked">Blocked</Option>
          </Select>
        </Form.Item>
        <Form.Item name="role" label="Role">
          <Select 
            mode="multiple"
            placeholder="Select role" 
            allowClear
            style={{ minWidth: 200 }}
          >
            <Option value="admin">Admin</Option>
            <Option value="user">User</Option>
            <Option value="manager">Manager</Option>
          </Select>
        </Form.Item>
        <Form.Item label=" ">
          <Space>
            <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
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