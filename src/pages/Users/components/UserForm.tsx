import { Form, Input, Button, Select, type FormInstance, Space } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { USER_STATUS, type User, type UserStatus } from '@/models/user';
import type {
  AssignRoleDTO,
  ChangePasswordDTO,
  CreateUserDTO,
  UpdateUserDTO,
} from '@/models/dto/user';
import { useGetSummaryRolesQuery } from '@/api/slices/roleApi';
import AvatarUpload from 'components/AvatarUpload';
import styled from 'styled-components';
import { useState, useEffect } from 'react';

const { Option } = Select;

const CenteredDiv = styled.div`
  display: flex;
  justify-content: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// --- Advanced Type Definitions ---

// Action types for the form
const USER_FORM_ACTIONS = {
  CREATE: 'create',
  UPDATE_INFO: 'update-info',
  CHANGE_PASSWORD: 'change-password',
  ASSIGN_ROLE: 'assign-role',
} as const;

type UserFormAction =
  (typeof USER_FORM_ACTIONS)[keyof typeof USER_FORM_ACTIONS];

// Union type for update actions and their corresponding DTOs
type UpdatePayload =
  | { action: typeof USER_FORM_ACTIONS.UPDATE_INFO; values: UpdateUserDTO }
  | {
      action: typeof USER_FORM_ACTIONS.CHANGE_PASSWORD;
      values: ChangePasswordDTO;
    }
  | { action: typeof USER_FORM_ACTIONS.ASSIGN_ROLE; values: AssignRoleDTO };

type withFormInstance<T> = T & { form: FormInstance };

// Generic props definition using a conditional type for onSubmit
interface UserFormProps<T extends User | undefined> {
  initialValues?: T;
  onSubmit: T extends User
    ? (payload: withFormInstance<UpdatePayload>) => Promise<void>
    : (
        payload: withFormInstance<{
          action: typeof USER_FORM_ACTIONS.CREATE;
          values: CreateUserDTO;
        }>
      ) => Promise<void>;
  isLoading?: boolean;
}

// --- UserForm Component ---

function UserForm<T extends User | undefined>(props: UserFormProps<T>) {
  const [form] = Form.useForm();
  const { data: rolesData, isLoading: isRolesLoading } =
    useGetSummaryRolesQuery();

  const { initialValues, onSubmit, isLoading } = props;

  const isUpdateMode = !!initialValues;

  const [action, setAction] = useState<Exclude<UserFormAction, 'create'>>(
    USER_FORM_ACTIONS.UPDATE_INFO
  );

  // Update form values when initialValues change
  useEffect(() => {
    if (initialValues && isUpdateMode) {
      switch (action) {
        case USER_FORM_ACTIONS.UPDATE_INFO: {
          const formValues: UpdateUserDTO = {
            name: initialValues.name,
            email: initialValues.email,
            avatarUrl: initialValues.avatarUrl,
            status: initialValues.status,
          };
          form.setFieldsValue(formValues);
          break;
        }
        case USER_FORM_ACTIONS.ASSIGN_ROLE: {
          const formValues: AssignRoleDTO = {
            roles: initialValues.roles.map((role) => role.id),
          };
          form.setFieldsValue(formValues);
          break;
        }
        // For CHANGE_PASSWORD, we don't prefill any values
        default:
          form.setFieldsValue({});
      }
    }
  }, [initialValues, isUpdateMode, action, form]);

  const handleSummit = async (values: any) => {
    if (isUpdateMode) {
      // The onSubmit type is correctly inferred as the one for updates
      const updateOnSubmit = onSubmit as UserFormProps<User>['onSubmit'];
      await updateOnSubmit({ action, values, form });
    } else {
      // The onSubmit type is correctly inferred as the one for creation
      const createOnSubmit = onSubmit as UserFormProps<undefined>['onSubmit'];
      await createOnSubmit({ action: USER_FORM_ACTIONS.CREATE, values, form });
    }
    // Only reset fields for create mode, not for update mode
    if (!isUpdateMode) {
      form.resetFields();
    }
  };

  const currentAction = isUpdateMode ? action : USER_FORM_ACTIONS.CREATE;

  const getButtonText = () => {
    switch (currentAction) {
      case USER_FORM_ACTIONS.CREATE:
        return 'Tạo người dùng';
      case USER_FORM_ACTIONS.UPDATE_INFO:
        return 'Cập nhật thông tin';
      case USER_FORM_ACTIONS.CHANGE_PASSWORD:
        return 'Đổi mật khẩu';
      case USER_FORM_ACTIONS.ASSIGN_ROLE:
        return 'Gán vai trò';
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      name="user_form"
      onFinish={handleSummit}
      style={{ maxWidth: 600, margin: '0 auto' }}
    >
      {/* --- Fields for CREATE or UPDATE_INFO --- */}
      {(currentAction === USER_FORM_ACTIONS.CREATE ||
        currentAction === USER_FORM_ACTIONS.UPDATE_INFO) && (
        <>
          <Form.Item name="avatar" label="Ảnh đại diện">
            <CenteredDiv>
              <AvatarUpload />
            </CenteredDiv>
          </Form.Item>
          {currentAction === USER_FORM_ACTIONS.CREATE && (
            <Form.Item
              name="username"
              label="Tên đăng nhập"
              rules={[
                { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" />
            </Form.Item>
          )}
          <Form.Item
            name="name"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
          >
            <Input placeholder="Họ và tên" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
        </>
      )}

      {/* --- Fields only for CREATE --- */}
      {currentAction === USER_FORM_ACTIONS.CREATE && (
        <>
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
                    new Error(
                      'Hai mật khẩu bạn nhập không khớp!'
                    )
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
        </>
      )}

      {/* --- Fields only for CHANGE_PASSWORD --- */}
      {currentAction === USER_FORM_ACTIONS.CHANGE_PASSWORD && (
        <>
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
            name="confirm"
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
                    new Error(
                      'Hai mật khẩu bạn nhập không khớp!'
                    )
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
        </>
      )}

      {/* --- Fields for ROLES (create and assign-role) --- */}
      {(currentAction === USER_FORM_ACTIONS.CREATE ||
        currentAction === USER_FORM_ACTIONS.ASSIGN_ROLE) && (
        <Form.Item name="roles" label="Vai trò">
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
      )}

      {/* --- Fields only for UPDATE_INFO --- */}
      {currentAction === USER_FORM_ACTIONS.UPDATE_INFO && (
        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
        >
          <Select placeholder="Chọn trạng thái">
            {Object.values(USER_STATUS).map((status: UserStatus) => (
              <Option key={status} value={status}>
                <span style={{ textTransform: 'capitalize' }}>{status}</span>
              </Option>
            ))}
          </Select>
        </Form.Item>
      )}

      {/* --- Submit Button and Action-switching Buttons --- */}
      <Form.Item>
        <ButtonContainer>
          <div>
            {isUpdateMode && (
              <Space>
                <Button
                  onClick={() => setAction(USER_FORM_ACTIONS.UPDATE_INFO)}
                  disabled={action === USER_FORM_ACTIONS.UPDATE_INFO}
                >
                  Cập nhật thông tin
                </Button>
                <Button
                  onClick={() => setAction(USER_FORM_ACTIONS.CHANGE_PASSWORD)}
                  disabled={action === USER_FORM_ACTIONS.CHANGE_PASSWORD}
                >
                  Đổi mật khẩu
                </Button>
                <Button
                  onClick={() => setAction(USER_FORM_ACTIONS.ASSIGN_ROLE)}
                  disabled={action === USER_FORM_ACTIONS.ASSIGN_ROLE}
                >
                  Gán vai trò
                </Button>
              </Space>
            )}
          </div>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {getButtonText()}
          </Button>
        </ButtonContainer>
      </Form.Item>
    </Form>
  );
}

export default UserForm;
