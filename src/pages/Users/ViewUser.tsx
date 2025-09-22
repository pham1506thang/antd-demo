import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Space, Button, Descriptions, Avatar, Tag, Flex } from 'antd';
import { ArrowLeftOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
import { userApi } from '@/api/slices/userApi';
import { DOMAINS } from '@/models/permission';
import { getUserStatusColor, getUserStatusText } from '@/helpers/user';
import { isApiError } from '@/models/error';
import { LoadingView, ErrorView, RestrictedAction, TitleWithoutMargin } from '@/components';


export const ViewUser: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  // Fetch user data
  const { data: user, isLoading, error } = userApi.useGetUserQuery(userId!, {
    skip: !userId,
  });

  const handleEdit = () => {
    navigate(`/${DOMAINS.USERS.value}/edit/${userId}`);
  };

  const handleBack = () => {
    navigate(`/${DOMAINS.USERS.value}`);
  };

  if (isLoading) {
    return <LoadingView message="Đang tải thông tin người dùng..." />;
  }

  if (error || !user) {
    // Extract status code from error, default to 404 if no user data
    const statusCode = error && isApiError(error) ? error.statusCode : 404;
    
    return (
      <ErrorView
        status={statusCode}
        onBack={handleBack}
        backButtonText="Quay lại danh sách"
      />
    );
  }


  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Flex justify="space-between" align="center">
        <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
          Quay lại danh sách
        </Button>
        <RestrictedAction domain="USERS" action="EDIT">
          <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
            Chỉnh sửa
          </Button>
        </RestrictedAction>
      </Flex>

      <TitleWithoutMargin level={2}>Chi tiết người dùng</TitleWithoutMargin>
      
      <Card>
        <Flex justify="center" style={{ marginBottom: 24 }}>
          <Avatar size={120} src={user.avatarUrl} icon={<UserOutlined />} />
        </Flex>

        <Descriptions
          bordered
          column={1}
          size="middle"
          styles={{ label: { fontWeight: 'bold', width: '200px' } }}
        >
          <Descriptions.Item label="Tên đăng nhập">
            {user.username}
          </Descriptions.Item>
          
          <Descriptions.Item label="Họ và tên">
            {user.name}
          </Descriptions.Item>
          
          <Descriptions.Item label="Email">
            {user.email}
          </Descriptions.Item>
          
          <Descriptions.Item label="Trạng thái">
            <Tag color={getUserStatusColor(user.status)}>
              {getUserStatusText(user.status)}
            </Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label="Vai trò">
            {user.roles.length > 0 ? (
              <Space wrap>
                {user.roles.map((role) => (
                  <Tag key={role.id} color="blue">
                    {role.label}
                  </Tag>
                ))}
              </Space>
            ) : (
              <Tag color="default">Chưa có vai trò</Tag>
            )}
          </Descriptions.Item>
          
          <Descriptions.Item label="Ngày tạo">
            {user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}
          </Descriptions.Item>
          
          <Descriptions.Item label="Ngày cập nhật">
            {user.updatedAt ? new Date(user.updatedAt).toLocaleString() : 'N/A'}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </Space>
  );
};

