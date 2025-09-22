import { useEffect } from 'react';
import { Form, Input, Button, Card, Row, Col, Space, Select, Flex, type FormInstance } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { USER_STATUS, type User, type UserStatus } from '@/models/user';
import { useGetSummaryRolesQuery } from '@/api/slices/roleApi';
import { AvatarUpload } from '@/components';
import { RestrictedAction } from '@/components/RestrictedAction';
import { getUserStatusText, getUserStatusColor } from '@/helpers/user';
import { USER_FORM_ACTIONS, type UserFormAction } from '../constants';
import type { CreateUserDTO, UpdateUserDTO, ChangePasswordDTO, AssignRoleDTO } from '@/models/dto/user';
import styled from 'styled-components';

const { Option } = Select;

const CenteredDiv = styled.div`
  display: flex;
  justify-content: center;
`;

export type UserFormValues =
  | { action: typeof USER_FORM_ACTIONS.CREATE; values: CreateUserDTO }
  | { action: typeof USER_FORM_ACTIONS.UPDATE_INFO; values: UpdateUserDTO }
  | { action: typeof USER_FORM_ACTIONS.CHANGE_PASSWORD; values: ChangePasswordDTO }
  | { action: typeof USER_FORM_ACTIONS.ASSIGN_ROLE; values: AssignRoleDTO };

export type UserFormPayload = UserFormValues & {
  form: FormInstance<any>;
};

interface UserFormLayoutProps {
  initialValues?: User;
  onSubmit: (payload: UserFormPayload) => Promise<void>;
  isLoading?: boolean;
}

export function UserFormLayout(props: UserFormLayoutProps) {
  const { data: rolesData, isLoading: isRolesLoading } = useGetSummaryRolesQuery();
  const { initialValues, onSubmit, isLoading } = props;
  const [form] = Form.useForm();
  const isEdit = !!initialValues;

  useEffect(() => {
    if (initialValues && isEdit) {
      const formValues = {
        username: initialValues.username,
        name: initialValues.name,
        email: initialValues.email,
        avatarUrl: initialValues.avatarUrl,
        status: initialValues.status,
        roles: initialValues.roles.map((role) => role.id),
      };
      form.setFieldsValue(formValues);
    }
  }, [initialValues, isEdit, form]);

  const getFieldsForAction = (action: UserFormAction): string[] => {
    switch (action) {
      case USER_FORM_ACTIONS.CREATE:
        return ['username', 'name', 'email', 'password', 'confirm', 'roles'];
      case USER_FORM_ACTIONS.UPDATE_INFO:
        return ['name', 'email', 'status'];
      case USER_FORM_ACTIONS.CHANGE_PASSWORD:
        return ['currentPassword', 'newPassword', 'confirmNewPassword'];
      case USER_FORM_ACTIONS.ASSIGN_ROLE:
        return ['roles'];
      default:
        return [];
    }
  };

  const validateFieldsByAction = async (action: UserFormAction): Promise<any> => {
    const fieldsToValidate = getFieldsForAction(action);

    try {
      const values = await form.validateFields(fieldsToValidate);
      return values;
    } catch (error) {
      console.log('Validation failed for action:', action, error);
      throw error;
    }
  };

  const handleFormSubmit = async (action: UserFormAction) => {
    try {
      const { confirm: _confirm, confirmNewPassword: _confirmNewPassword, ...values } = await validateFieldsByAction(action);
      const payload = {
        values,
        action,
        form
      } as UserFormPayload;
      await onSubmit(payload);
    } catch (error) {
      console.debug('Error submitting form:', error);
    }
  };


  return (
    <Form
      form={form}
      layout="vertical"
      name="user_form"
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Basic Information Card */}
        <Card title="Thông tin cơ bản">
          {/* Avatar upload - only in edit mode */}
          {isEdit && (
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Form.Item name="avatar" label="Ảnh đại diện">
                  <CenteredDiv>
                    <AvatarUpload />
                  </CenteredDiv>
                </Form.Item>
              </Col>
            </Row>
          )}

          <Row gutter={[16, 0]}>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                name="username"
                label="Tên đăng nhập"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Tên đăng nhập"
                  disabled={isEdit}
                  style={{
                    backgroundColor: isEdit ? '#f5f5f5' : '#fff',
                    cursor: isEdit ? 'not-allowed' : 'text'
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                name="name"
                label="Họ và tên"
              >
                <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email" />
              </Form.Item>
            </Col>
            {isEdit && (
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  name="status"
                  label="Trạng thái"
                  rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                >
                  <Select
                    placeholder="Chọn trạng thái"
                    optionRender={(option) => {
                      const color = getUserStatusColor(option.value as string);
                      return (
                        <div style={{ color: color }}>
                          {option.label}
                        </div>
                      );
                    }}
                  >
                    {Object.values(USER_STATUS).map((status: UserStatus) => (
                      <Option key={status} value={status}>
                        {getUserStatusText(status)}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            )}
          </Row>

          {/* Action button for basic info - only in edit mode */}
          {isEdit && (
            <Flex justify="end">
              <RestrictedAction domain="USERS" action="EDIT">
                <Button
                  type="primary"
                  onClick={() => handleFormSubmit(USER_FORM_ACTIONS.UPDATE_INFO)}
                  loading={isLoading}
                >
                  Cập nhật thông tin
                </Button>
              </RestrictedAction>
            </Flex>
          )}

        </Card>

        {/* Password and Roles Row */}
        <Row gutter={[16, 16]}>
          {/* Password Card - only for create mode */}
          {!isEdit && (
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Card title="Mật khẩu">
                <Form.Item
                  name="password"
                  label="Mật khẩu"
                  rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                  hasFeedback
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
                </Form.Item>

                <Form.Item
                  name="confirm"
                  label="Xác nhận mật khẩu"
                  dependencies={['password']}
                  hasFeedback
                  rules={[
                    { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error('Hai mật khẩu bạn nhập không khớp!')
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Xác nhận mật khẩu"
                  />
                </Form.Item>
              </Card>
            </Col>
          )}

          {/* Change Password Card - only for edit mode */}
          {isEdit && (
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Card title="Đổi mật khẩu">
                <Form.Item
                  name="currentPassword"
                  label="Mật khẩu hiện tại"
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập mật khẩu hiện tại!',
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Mật khẩu hiện tại"
                  />
                </Form.Item>

                <Form.Item
                  name="newPassword"
                  label="Mật khẩu mới"
                  rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Mật khẩu mới"
                  />
                </Form.Item>

                <Form.Item
                  name="confirmNewPassword"
                  label="Xác nhận mật khẩu mới"
                  dependencies={['newPassword']}
                  hasFeedback
                  rules={[
                    { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('newPassword') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error('Hai mật khẩu bạn nhập không khớp!')
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Xác nhận mật khẩu mới"
                  />
                </Form.Item>

                <Flex justify="end">
                  <RestrictedAction domain="USERS" action="CHANGE_PASSWORD">
                    <Button
                      type="primary"
                      onClick={() => handleFormSubmit(USER_FORM_ACTIONS.CHANGE_PASSWORD)}
                      loading={isLoading}
                    >
                      Đổi mật khẩu
                    </Button>
                  </RestrictedAction>
                </Flex>
              </Card>
            </Col>
          )}

          {/* Roles Card */}
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Card title="Vai trò">
              <Form.Item
                name="roles"
                label="Vai trò"
              >
                <Select
                  mode="multiple"
                  placeholder="Chọn vai trò"
                  loading={isRolesLoading}
                >
                  {rolesData?.map((role) => (
                    <Option key={role.id} value={role.id}>
                      {role.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Action button for roles - only in edit mode */}
              {isEdit && (
                <Flex justify="end">
                  <RestrictedAction domain="USERS" action="ASSIGN_ROLE">
                    <Button
                      type="primary"
                      onClick={() => handleFormSubmit(USER_FORM_ACTIONS.ASSIGN_ROLE)}
                      loading={isLoading}
                    >
                      Cập nhật vai trò
                    </Button>
                  </RestrictedAction>
                </Flex>
              )}
            </Card>
          </Col>
        </Row>

        {/* Create user button - only in create mode */}
        {!isEdit && (
          <Flex justify="end">
            <RestrictedAction domain="USERS" action="CREATE">
              <Button
                type="primary"
                onClick={() => handleFormSubmit(USER_FORM_ACTIONS.CREATE)}
                loading={isLoading}
              >
                Tạo người dùng
              </Button>
            </RestrictedAction>
          </Flex>
        )}
      </Space>
    </Form>
  );
}

export default UserFormLayout;
