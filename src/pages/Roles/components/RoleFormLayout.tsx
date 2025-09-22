import React, { useState } from 'react';
import { Form, Input, Button, Tabs, Card, Row, Col, Space, Typography, Badge, Checkbox, Flex, type FormInstance } from 'antd';
import { useGetPermissionsQuery } from '@/api/slices/permissionApi';
import type { Role } from '@/models/role';
import { COLORS } from '@/constants/colors';
import { PermissionDomainSelector } from './PermissionDomainSelector';
import { PermissionPresets } from './PermissionPresets';
import { PermissionAdvancedEditor } from './PermissionAdvancedEditor';
import { RestrictedAction } from '@/components';
import { ROLE_FORM_ACTIONS, type RoleFormAction } from '../constants';
import type { CreateRoleDTO, UpdateRoleDTO, AssignPermissionsDTO } from '@/models/dto/role';
import {
  selectAllDomainPermissions,
  deselectAllDomainPermissions,
  selectAllPermissions,
  clearAllPermissions,
} from '../helpers/permissionHelpers';

const { Text } = Typography;

export type RoleFormValues = 
  | { action: typeof ROLE_FORM_ACTIONS.CREATE; values: CreateRoleDTO }
  | { action: typeof ROLE_FORM_ACTIONS.UPDATE_INFO; values: UpdateRoleDTO }
  | { action: typeof ROLE_FORM_ACTIONS.UPDATE_PERMISSIONS; values: AssignPermissionsDTO };

export type RoleFormPayload = RoleFormValues & {
  form: FormInstance<any>;
};

interface RoleFormLayoutProps {
  initialValues?: Role;
  onSubmit: (payload: RoleFormPayload) => Promise<void>;
  isLoading?: boolean;
}

export function RoleFormLayout(props: RoleFormLayoutProps) {
  const { data: permissionsData } = useGetPermissionsQuery();

  const { initialValues, onSubmit, isLoading } = props;
  const [form] = Form.useForm();
  const isEdit = !!initialValues;
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const getFieldsForAction = (action: RoleFormAction): string[] => {
    switch (action) {
      case ROLE_FORM_ACTIONS.CREATE:
        return ['code', 'label', 'description', 'permissions'];
      case ROLE_FORM_ACTIONS.UPDATE_INFO:
        return ['label', 'description'];
      case ROLE_FORM_ACTIONS.UPDATE_PERMISSIONS:
        return ['permissions'];
      default:
        return [];
    }
  };

  const validateFieldsByAction = async (action: RoleFormAction): Promise<any> => {
    const fieldsToValidate = getFieldsForAction(action);
    
    try {
      const values = await form.validateFields(fieldsToValidate);
      return values;
    } catch (error) {
      console.log('Validation failed for action:', action, error);
      throw error;
    }
  };

  const handleFormSubmit = async (action: RoleFormAction) => {
    try {
      const values = await validateFieldsByAction(action);
      const payload = {
        values,
        action,
        form
      };
      await onSubmit(payload);
    } catch (error) {
      console.debug('Error submitting form:', error);
    }
  };

  React.useEffect(() => {
    if (initialValues) {
      const formValues = {
        code: initialValues.code,
        label: initialValues.label,
        description: initialValues.description || undefined,
        permissions: initialValues.permissions.map((permission) => permission.id),
      };
      form.setFieldsValue(formValues);
      setSelectedPermissions(formValues.permissions);
    }
  }, [initialValues, form]);

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

  return (
    <Form
      form={form}
      layout="vertical"
      name="role_form"
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Basic Information */}
        <Card title="Thông tin cơ bản">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="code"
                label="Mã vai trò"
                rules={[{ required: true, message: 'Vui lòng nhập mã vai trò!' }]}
              >
                <Input
                  placeholder="Nhập mã vai trò"
                  disabled={isEdit}
                  style={{
                    backgroundColor: isEdit ? COLORS.GRAY_3 : COLORS.GRAY_1,
                    cursor: isEdit ? 'not-allowed' : 'text'
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

          {isEdit && (
            <Flex justify="end">
              <RestrictedAction domain="ROLES" action="EDIT">
                <Button
                  type="primary"
                  onClick={() => handleFormSubmit(ROLE_FORM_ACTIONS.UPDATE_INFO)}
                  loading={isLoading}
                >
                  Cập nhật thông tin
                </Button>
              </RestrictedAction>
            </Flex>
          )}

        </Card>

        {/* Permission Management */}
        <Card title="Quản lý quyền">
          <Form.Item
            name="permissions"
            rules={[
              {
                validator: (_, value) => {
                  if (!value || value.length === 0) {
                    return Promise.reject(new Error('Vui lòng chọn ít nhất một quyền!'));
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Tabs 
              defaultActiveKey="permissions" 
              type="card"
              items={[
                {
                  key: 'permissions',
                  label: 'Theo miền',
                  children: (
                    <PermissionDomainSelector
                      permissions={permissionsData || []}
                      selectedPermissions={selectedPermissions}
                      onPermissionChange={handlePermissionChange}
                      onSelectAllDomain={handleSelectAllDomain}
                      onDeselectAllDomain={handleDeselectAllDomain}
                    />
                  ),
                },
                {
                  key: 'presets',
                  label: 'Mẫu có sẵn',
                  children: (
                    <PermissionPresets
                      permissions={permissionsData || []}
                      onPresetSelect={handlePresetSelect}
                    />
                  ),
                },
                {
                  key: 'advanced',
                  label: 'Nâng cao',
                  children: (
                    <PermissionAdvancedEditor
                      permissions={permissionsData || []}
                      selectedPermissions={selectedPermissions}
                      onPermissionChange={handlePermissionChange}
                    />
                  ),
                },
              ]}
            />
          </Form.Item>
          {/* Summary and Actions */}
          <div style={{ marginTop: 16 }}>
            <Row justify="space-between" align="middle">
              <Col>
                <Space>
                  <Text strong>Tổng quyền: </Text>
                  <Badge count={selectedPermissions.length} style={{ backgroundColor: COLORS.PRIMARY }} />
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
                {/* Update permissions button - only in edit mode */}
                {isEdit && (
                  <RestrictedAction domain="ROLES" action="ASSIGN_PERMISSION">
                    <Button
                      type="primary"
                      onClick={() => handleFormSubmit(ROLE_FORM_ACTIONS.UPDATE_PERMISSIONS)}
                      loading={isLoading}
                    >
                      Cập nhật quyền
                    </Button>
                  </RestrictedAction>
                )}
              </Col>
            </Row>
          </div>
        </Card>


        {/* Create role button - outside card, only in create mode */}
        {!isEdit && (
          <Flex justify="end">
            <RestrictedAction domain="ROLES" action="CREATE">
              <Button
                type="primary"
                onClick={() => handleFormSubmit(ROLE_FORM_ACTIONS.CREATE)}
                loading={isLoading}
              >
                Tạo vai trò
              </Button>
            </RestrictedAction>
          </Flex>
        )}
      </Space>
    </Form>
  );
}

export default RoleFormLayout;