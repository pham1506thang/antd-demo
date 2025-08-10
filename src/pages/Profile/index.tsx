import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Descriptions,
  Button,
  Space,
  Divider,
  message,
  Tooltip,
} from 'antd';
import {
  EditOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { selectMe } from 'store/slices/meSlice';
import ProfileForm from './components/ProfileForm';
import ChangePasswordForm from './components/ChangePasswordForm';
import AvatarUpload from './components/AvatarUpload';
import { RoleTag } from 'components/index';
import StatusTag from 'components/StatusTag';

const { Title } = Typography;

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const me = useSelector(selectMe);

  const handleEditClick = () => {
    setIsEditing(true);
    setIsChangingPassword(false);
  };

  const handleChangePasswordClick = () => {
    setIsChangingPassword(true);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsChangingPassword(false);
  };

  if (!me) {
    return null;
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 0' }}>
      <Title level={2}>Profile</Title>

      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <Row gutter={24} align="middle">
              <Col>
                <AvatarUpload avatarUrl={me.avatarUrl} />
              </Col>
              <Col flex="auto">
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Title level={4} style={{ margin: 0 }}>
                    {me.name || me.username}
                  </Title>
                  <Space size={[0, 8]} wrap>
                    {me.roles.map((role) => (
                      <RoleTag key={role._id} role={role} />
                    ))}
                  </Space>
                  <StatusTag status={me.status} />
                </Space>
              </Col>
              <Col>
                <Space>
                  <Button
                    icon={<EditOutlined />}
                    onClick={handleEditClick}
                    type={isEditing ? 'primary' : 'default'}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    icon={<LockOutlined />}
                    onClick={handleChangePasswordClick}
                    type={isChangingPassword ? 'primary' : 'default'}
                  >
                    Change Password
                  </Button>
                </Space>
              </Col>
            </Row>

            <Divider />

            {!isEditing && !isChangingPassword && (
              <Descriptions column={2}>
                <Descriptions.Item label="Username">
                  {me.username}
                </Descriptions.Item>
                <Descriptions.Item label="Email">{me.email}</Descriptions.Item>
                <Descriptions.Item label="Name">{me.name}</Descriptions.Item>
                <Descriptions.Item label="Status">
                  <StatusTag status={me.status} />
                </Descriptions.Item>
                <Descriptions.Item label="Last Login">
                  {me.lastLogin
                    ? new Date(me.lastLogin).toLocaleString()
                    : 'Never'}
                </Descriptions.Item>
                <Descriptions.Item label="Roles" span={2}>
                  <Space size={[8, 8]} wrap>
                    {me.roles.map((role) => (
                      <Tooltip 
                        key={role._id} 
                        title={
                          <>
                            {role.isAdmin && "Administrator role with full access"}
                            {role.isProtected && "Protected role with restricted access"}
                            {!role.isAdmin && !role.isProtected && "Standard role"}
                          </>
                        }
                      >
                        <span>
                          <RoleTag role={role} />
                        </span>
                      </Tooltip>
                    ))}
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            )}

            {isEditing && (
              <ProfileForm
                initialValues={me}
                onCancel={handleCancel}
                onSuccess={() => {
                  setIsEditing(false);
                  message.success('Profile updated successfully');
                }}
              />
            )}

            {isChangingPassword && (
              <ChangePasswordForm
                onCancel={handleCancel}
                onSuccess={() => {
                  setIsChangingPassword(false);
                  message.success('Password changed successfully');
                }}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage; 