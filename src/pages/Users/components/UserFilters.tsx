import React from 'react';
import { Form, Input, Select, Button, Space, Tag } from 'antd';
import { SearchOutlined, UndoOutlined } from '@ant-design/icons';
import { USER_STATUS } from 'models/user';
import { getUserStatusText, getUserStatusColor } from '@/helpers/user';
import { useGetSummaryRolesQuery } from '@/api/slices/roleApi';
import { COLORS } from '@/constants/colors';

const { Option } = Select;

// Create array of status options from USER_STATUS
const statusOptions = Object.values(USER_STATUS).map((status) => ({
  value: status,
  label: getUserStatusText(status),
}));

export interface FilterValues {
  search?: string;
  status?: string[];
  roles?: string[];
}

interface UserFiltersProps {
  values: FilterValues;
  onChange: (allValues: FilterValues) => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({ values, onChange }) => {
  const [form] = Form.useForm<FilterValues>();
  const { data: rolesData, isLoading: isRolesLoading } =
    useGetSummaryRolesQuery();

  const onValuesChange = (_changedValues: any, _allValues: FilterValues) => {
    // Call the onChange prop with the changed values and all values
    onChange(_allValues);
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
            placeholder="Tìm kiếm theo tên, email..."
            prefix={<SearchOutlined />}
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item name="status" label="Trạng thái">
          <Select
            mode="multiple"
            placeholder="Chọn trạng thái"
            allowClear
            style={{ minWidth: 200 }}
            options={statusOptions}
            optionRender={(option) => {
              const color = getUserStatusColor(option.value as string);
              return (
                <div style={{ 
                  color: color,
                }}>
                  {option.label}
                </div>
              );
            }}
            tagRender={(props) => {
              const { label, value, closable, onClose } = props;
              return (
                <Tag
                  color={getUserStatusColor(value as string)}
                  closable={closable}
                  onClose={onClose}
                  style={{ marginRight: 3 }}
                >
                  {label}
                </Tag>
              );
            }}
          />
        </Form.Item>
        <Form.Item name="roles" label="Vai trò">
          <Select
            mode="multiple"
            placeholder="Chọn vai trò"
            allowClear
            style={{ minWidth: 200, width: '100%' }}
            loading={isRolesLoading}
          >
            {rolesData?.map((role) => (
              <Option key={role.id} value={role.id}>
                {role.label}
              </Option>
            ))}
          </Select>
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

export default UserFilters;
