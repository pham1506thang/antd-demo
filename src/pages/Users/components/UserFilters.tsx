import React from "react";
import { Form, Input, Select, Button, Space } from "antd";
import { SearchOutlined, UndoOutlined } from "@ant-design/icons";

const { Option } = Select;

export interface FilterValues {
  search?: string;
  status?: string[];
  role?: string[];
}

interface UserFiltersProps {
  values: FilterValues;
  onChange: (allValues: FilterValues) => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({ values, onChange }) => {
  const [form] = Form.useForm();

  const onValuesChange = (_changedValues: any, allValues: FilterValues) => {
    // Call the onChange prop with the changed values and all values
    onChange(allValues);
  };

  const handleReset = () => {
    form.resetFields();
    onChange({});
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={values}
      onValuesChange={onValuesChange}
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
          <Button
            htmlType="reset"
            icon={<UndoOutlined />}
            onClick={handleReset}
          >
            Reset
          </Button>
        </Form.Item>
      </Space>
    </Form>
  );
};

export default UserFilters;
