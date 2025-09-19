import React from 'react';
import { Form, Input, Button, Space, Switch } from 'antd';
import { SearchOutlined, UndoOutlined } from '@ant-design/icons';

export interface FilterValues {
  search?: string;
  isProtected?: boolean;
}

interface RoleFiltersProps {
  values: FilterValues;
  onChange: (allValues: FilterValues) => void;
}

const RoleFilters: React.FC<RoleFiltersProps> = ({ values, onChange }) => {
  const [form] = Form.useForm<FilterValues>();

  const onValuesChange = (_changedValues: any, allValues: FilterValues) => {
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
        <Form.Item name="search" label="Tìm kiếm">
          <Input
            placeholder="Tìm kiếm theo mã, tên..."
            prefix={<SearchOutlined />}
          />
        </Form.Item>
        <Form.Item name="isProtected" label="Vai trò được bảo vệ" valuePropName="checked">
          <Switch 
            checkedChildren="Có" 
            unCheckedChildren="Không"
          />
        </Form.Item>
        <Form.Item label=" ">
          <Button
            htmlType="reset"
            icon={<UndoOutlined />}
            onClick={handleReset}
          >
Đặt lại bộ lọc
          </Button>
        </Form.Item>
      </Space>
    </Form>
  );
};

export default RoleFilters;