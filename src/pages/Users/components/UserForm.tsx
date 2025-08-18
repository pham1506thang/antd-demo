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
        return 'Create User';
      case USER_FORM_ACTIONS.UPDATE_INFO:
        return 'Update Info';
      case USER_FORM_ACTIONS.CHANGE_PASSWORD:
        return 'Change Password';
      case USER_FORM_ACTIONS.ASSIGN_ROLE:
        return 'Assign Roles';
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
          <Form.Item name="avatar" label="Avatar">
            <CenteredDiv>
              <AvatarUpload />
            </CenteredDiv>
          </Form.Item>
          {currentAction === USER_FORM_ACTIONS.CREATE && (
            <Form.Item
              name="username"
              label="Username"
              rules={[
                { required: true, message: 'Please input the username!' },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>
          )}
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please input the full name!' }]}
          >
            <Input placeholder="Full Name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ type: 'email', message: 'Please input a valid email!' }]}
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
            label="Password"
            rules={[{ required: true, message: 'Please input the password!' }]}
            hasFeedback
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      'The two passwords that you entered do not match!'
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
            />
          </Form.Item>
        </>
      )}

      {/* --- Fields only for CHANGE_PASSWORD --- */}
      {currentAction === USER_FORM_ACTIONS.CHANGE_PASSWORD && (
        <>
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[
              {
                required: true,
                message: 'Please input your current password!',
              },
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Current Password"
            />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: 'Please input the new password!' },
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="New Password"
            />
          </Form.Item>
          <Form.Item
            name="confirm"
            label="Confirm New Password"
            dependencies={['newPassword']}
            hasFeedback
            rules={[
              { required: true, message: 'Please confirm your new password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      'The two passwords that you entered do not match!'
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm New Password"
            />
          </Form.Item>
        </>
      )}

      {/* --- Fields for ROLES (create and assign-role) --- */}
      {(currentAction === USER_FORM_ACTIONS.CREATE ||
        currentAction === USER_FORM_ACTIONS.ASSIGN_ROLE) && (
        <Form.Item name="roles" label="Roles">
          <Select
            mode="multiple"
            placeholder="Select roles"
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
          label="Status"
          rules={[{ required: true, message: 'Please select a status!' }]}
        >
          <Select placeholder="Select status">
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
                  Update Info
                </Button>
                <Button
                  onClick={() => setAction(USER_FORM_ACTIONS.CHANGE_PASSWORD)}
                  disabled={action === USER_FORM_ACTIONS.CHANGE_PASSWORD}
                >
                  Change Password
                </Button>
                <Button
                  onClick={() => setAction(USER_FORM_ACTIONS.ASSIGN_ROLE)}
                  disabled={action === USER_FORM_ACTIONS.ASSIGN_ROLE}
                >
                  Assign Roles
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
