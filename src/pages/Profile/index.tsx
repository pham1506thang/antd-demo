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
import { EditOutlined, LockOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import ProfileForm from './components/ProfileForm';
import ChangePasswordForm from './components/ChangePasswordForm';
import AvatarUpload from 'components/AvatarUpload';
import { RoleTag } from 'components/index';
import StatusTag from 'components/StatusTag';
import { meSelector } from '@/store/slices/authSlice';

const { Title } = Typography;

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const me = useSelector(meSelector);

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
      <Title level={2}>Hồ sơ cá nhân</Title>

      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <Row gutter={24} align="middle">
              <Col>
                <AvatarUpload avatarUrl={me.avatarUrl} />
              </Col>
              <Col flex="auto">
                <Space
                  direction="vertical"
                  size="small"
                  style={{ width: '100%' }}
                >
                  <Title level={4} style={{ margin: 0 }}>
                    {me.name || me.username}
                  </Title>
                  <Space size={[0, 8]} wrap>
                    {me.roles.map((role) => (
                      <RoleTag key={role.id} role={role} />
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
                    Chỉnh sửa hồ sơ
                  </Button>
                  <Button
                    icon={<LockOutlined />}
                    onClick={handleChangePasswordClick}
                    type={isChangingPassword ? 'primary' : 'default'}
                  >
                    Đổi mật khẩu
                  </Button>
                </Space>
              </Col>
            </Row>

            <Divider />

            {!isEditing && !isChangingPassword && (
              <Descriptions column={2}>
                <Descriptions.Item label="Tên đăng nhập">
                  {me.username}
                </Descriptions.Item>
                <Descriptions.Item label="Email">{me.email}</Descriptions.Item>
                <Descriptions.Item label="Họ và tên">{me.name}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  <StatusTag status={me.status} />
                </Descriptions.Item>
                <Descriptions.Item label="Lần đăng nhập cuối" span={2}>
                  {me.lastLogin
                    ? new Date(me.lastLogin).toLocaleString()
                    : 'Chưa bao giờ'}
                </Descriptions.Item>
                <Descriptions.Item label="Vai trò" span={2}>
                  <Space size={[8, 8]} wrap>
                    {me.roles.map((role) => (
                      <Tooltip
                        key={role.id}
                        title={
                          <>
                            {role.isAdmin &&
                              'Vai trò quản trị viên với quyền truy cập đầy đủ'}
                            {role.isProtected &&
                              'Vai trò được bảo vệ với quyền truy cập hạn chế'}
                            {!role.isAdmin &&
                              !role.isProtected &&
                              'Vai trò tiêu chuẩn'}
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
                  message.success('Cập nhật hồ sơ thành công');
                }}
              />
            )}

            {isChangingPassword && (
              <ChangePasswordForm
                onCancel={handleCancel}
                onSuccess={() => {
                  setIsChangingPassword(false);
                  message.success('Đổi mật khẩu thành công');
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
