import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Descriptions,
  Button,
  Space,
  Divider,
  Tooltip,
  Avatar,
  Flex,
} from 'antd';
import { CloseOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { ProfileForm } from './components/ProfileForm';
import { ChangePasswordForm } from './components/ChangePasswordForm';
import { RoleTag, TitleWithoutMargin, StatusTag } from '@/components';
import { meSelector } from '@/store/slices/authSlice';

export const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);

  const me = useSelector(meSelector);

  if (!me) {
    return null;
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Flex justify="space-between" align="center">
        <TitleWithoutMargin level={2}>Hồ sơ cá nhân</TitleWithoutMargin>
        <Button
          type={isEditing ? 'default' : 'primary'}
          icon={isEditing ? <CloseOutlined /> : <EditOutlined />}
          onClick={() => setIsEditing((prev) => !prev)}
        >
          {isEditing ? 'Huỷ' : 'Chỉnh sửa'}
        </Button>
      </Flex>

      {!isEditing && <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <Row gutter={[24, 8]} align="middle">
              <Col>
                <Avatar
                  src={me.avatarUrl}
                  icon={<UserOutlined />}
                  size={300}
                  shape="square"
                />
              </Col>
              <Col flex="auto">
                <Space
                  direction="vertical"
                  size="small"
                  style={{ width: '100%' }}
                >
                  <TitleWithoutMargin level={4}>
                    {[me.firstName, me.lastName].filter(Boolean).join(' ') ||
                      me.username}
                  </TitleWithoutMargin>
                  <Space size={[0, 8]} wrap>
                    {me.roles.map((role) => (
                      <RoleTag key={role.id} role={role} />
                    ))}
                  </Space>
                  <StatusTag status={me.status} />
                </Space>
              </Col>
            </Row>

            <Divider />

            {!isEditing && (
              <Descriptions column={2}>
                <Descriptions.Item label="Tên đăng nhập">
                  {me.username}
                </Descriptions.Item>
                <Descriptions.Item label="Email">{me.email}</Descriptions.Item>
                <Descriptions.Item label="Họ và tên">
                  {[me.firstName, me.lastName].filter(Boolean).join(' ') ||
                    'Chưa cập nhật'}
                </Descriptions.Item>
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
          </Card>
        </Col>
      </Row>}
      {isEditing && (
        <>
          <ProfileForm />
          <ChangePasswordForm />
        </>
      )}
    </Space>
  );
};
