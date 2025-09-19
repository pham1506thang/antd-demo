import React, { useState } from 'react';
import { Form, Input, Button, Tabs, Card, Row, Col, Space, Typography, Badge, Checkbox, type FormInstance } from 'antd';
import { useGetPermissionsQuery } from '@/api/slices/permissionApi';
import type { Role } from '@/models/role';
import type { CreateRoleDTO, UpdateRoleDTO } from '@/models/dto/role';
import PermissionDomainSelector from './PermissionDomainSelector';
import PermissionPresets from './PermissionPresets';
import PermissionAdvancedEditor from './PermissionAdvancedEditor';
import {
  selectAllDomainPermissions,
  deselectAllDomainPermissions,
  selectAllPermissions,
  clearAllPermissions,
} from '../helpers/permissionHelpers';

const { TabPane } = Tabs;
const { Text } = Typography;

// --- Advanced Type Definitions ---

type withFormInstance<T> = T & { form: FormInstance };

// Generic props definition using a conditional type for onSubmit
interface RoleFormProps<T extends Role | undefined> {
  initialValues?: T;
  onSubmit: T extends Role
    ? (payload: withFormInstance<{ values: UpdateRoleDTO }>) => Promise<void>
    : (
        payload: withFormInstance<{ values: CreateRoleDTO }>
      ) => Promise<void>;
  isLoading?: boolean;
}

// --- RoleForm Component ---

function RoleForm<T extends Role | undefined>(props: RoleFormProps<T>) {
  const [form] = Form.useForm();
  const { data: permissionsData } = useGetPermissionsQuery();

  const { initialValues, onSubmit, isLoading } = props;
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const isUpdateMode = !!initialValues;

  // Update form values when initialValues change
  React.useEffect(() => {
    if (initialValues && isUpdateMode) {
      const formValues: UpdateRoleDTO = {
        label: initialValues.label,
        description: initialValues.description || undefined,
        permissions: initialValues.permissions.map((permission) => permission.id),
      };
      form.setFieldsValue(formValues);
      setSelectedPermissions(formValues.permissions);
    }
  }, [initialValues, isUpdateMode, form]);

  // Update form when selectedPermissions change
  React.useEffect(() => {
    form.setFieldsValue({ permissions: selectedPermissions });
  }, [selectedPermissions, form]);

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions(prev => [...prev, permissionId]);
    } else {
      setSelectedPermissions(prev => prev.filter(id => id !== permissionId));
    }
  };

  const handleSelectAllDomain = (domain: string) => {
    if (!permissionsData) return;
    const newSelected = selectAllDomainPermissions(selectedPermissions, permissionsData, domain);
    setSelectedPermissions(newSelected);
  };

  const handleDeselectAllDomain = (domain: string) => {
    if (!permissionsData) return;
    const newSelected = deselectAllDomainPermissions(selectedPermissions, permissionsData, domain);
    setSelectedPermissions(newSelected);
  };

  const handlePresetSelect = (permissionIds: string[]) => {
    setSelectedPermissions(permissionIds);
  };

  const handleTotalCheckAll = (checked: boolean) => {
    if (checked) {
      if (!permissionsData) return;
      setSelectedPermissions(selectAllPermissions(permissionsData));
    } else {
      setSelectedPermissions(clearAllPermissions());
    }
  };

  const handleSubmit = async (values: any) => {
    const formValues = {
      ...values,
      permissions: selectedPermissions,
    };

    if (isUpdateMode) {
      // The onSubmit type is correctly inferred as the one for updates
      const updateOnSubmit = onSubmit as RoleFormProps<Role>['onSubmit'];
      await updateOnSubmit({ values: formValues, form });
    } else {
      // The onSubmit type is correctly inferred as the one for creation
      const createOnSubmit = onSubmit as RoleFormProps<undefined>['onSubmit'];
      await createOnSubmit({ values: formValues, form });
    }
    // Only reset fields for create mode, not for update mode
    if (!isUpdateMode) {
      form.resetFields();
      setSelectedPermissions([]);
    }
  };

  const getButtonText = () => {
    return isUpdateMode ? 'Cập nhật vai trò' : 'Tạo vai trò';
  };


  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* Basic Information */}
      <Card title="Thông tin cơ bản">
        <Form
          form={form}
          layout="vertical"
          name="role_form"
          onFinish={handleSubmit}
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="code"
                label="Mã vai trò"
                rules={[{ required: true, message: 'Vui lòng nhập mã vai trò!' }]}
              >
                <Input 
                  placeholder="Nhập mã vai trò" 
                  disabled={isUpdateMode}
                  style={{ 
                    backgroundColor: isUpdateMode ? '#f5f5f5' : 'white',
                    cursor: isUpdateMode ? 'not-allowed' : 'text'
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="label"
                label="Tên vai trò"
                rules={[{ required: true, message: 'Vui lòng nhập tên vai trò!' }]}
              >
                <Input placeholder="Nhập tên vai trò" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <Input 
              placeholder="Nhập mô tả vai trò (tùy chọn)"
              maxLength={200}
              showCount
            />
          </Form.Item>

        </Form>
      </Card>

      {/* Permission Management */}
      <Card title="Quản lý quyền">
        <Tabs defaultActiveKey="permissions" type="card">
          <TabPane tab="Theo miền" key="permissions">
            <PermissionDomainSelector
              permissions={permissionsData || []}
              selectedPermissions={selectedPermissions}
              onPermissionChange={handlePermissionChange}
              onSelectAllDomain={handleSelectAllDomain}
              onDeselectAllDomain={handleDeselectAllDomain}
            />
          </TabPane>

          <TabPane tab="Mẫu có sẵn" key="presets">
            <PermissionPresets
              permissions={permissionsData || []}
              onPresetSelect={handlePresetSelect}
            />
          </TabPane>

          <TabPane tab="Nâng cao" key="advanced">
            <PermissionAdvancedEditor
              permissions={permissionsData || []}
              selectedPermissions={selectedPermissions}
              onPermissionChange={handlePermissionChange}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* Summary and Actions */}
      <Card>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Text strong>Tổng quyền: </Text>
              <Badge count={selectedPermissions.length} style={{ backgroundColor: '#1890ff' }} />
              <Checkbox
                checked={selectedPermissions.length === (permissionsData?.length || 0) && selectedPermissions.length > 0}
                indeterminate={selectedPermissions.length > 0 && selectedPermissions.length < (permissionsData?.length || 0)}
                onChange={(e) => handleTotalCheckAll(e.target.checked)}
              >
                {selectedPermissions.length === (permissionsData?.length || 0) && selectedPermissions.length > 0 ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
              </Checkbox>
            </Space>
          </Col>
          <Col>
            <Button type="primary" onClick={() => form.submit()} loading={isLoading}>
              {getButtonText()}
            </Button>
          </Col>
        </Row>
      </Card>
    </Space>
  );
}

export default RoleForm;