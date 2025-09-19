import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Card, Space, Button, Descriptions, Avatar, Tag } from 'antd';
import { ArrowLeftOutlined, EditOutlined, UserOutlined } from '@ant-design/icons';
import { userApi } from '@/api/slices/userApi';
import { DOMAINS } from '@/models/permission';
import { getUserStatusColor } from '@/helpers/user';
import LoadingView from '@/components/LoadingView';
import ErrorView from '@/components/ErrorView';
import styled from 'styled-components';

const { Title } = Typography;

const CenteredDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ViewUser: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  // Fetch user data
  const { data: user, isLoading, error } = userApi.useGetUserQuery(userId!, {
    skip: !userId,
  });

  const handleEdit = () => {
    navigate(`/${DOMAINS.USERS.value}/update/${userId}`);
  };

  const handleBack = () => {
    navigate(`/${DOMAINS.USERS.value}`);
  };

  if (isLoading) {
    return <LoadingView message="Đang tải thông tin người dùng..." />;
  }

  if (error) {
    return (
      <ErrorView
        message="Lỗi"
        description="Không thể tải thông tin người dùng. Vui lòng thử lại."
        type="error"
        onBack={handleBack}
        backButtonText="Quay lại danh sách"
      />
    );
  }

  if (!user) {
    return (
      <ErrorView
        message="Không tìm thấy"
        description="Không tìm thấy người dùng."
        type="warning"
        onBack={handleBack}
        backButtonText="Quay lại danh sách"
      />
    );
  }


  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <ButtonContainer>
        <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
          Quay lại danh sách
        </Button>
        <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
          Chỉnh sửa
        </Button>
      </ButtonContainer>

      <Title level={2}>Chi tiết người dùng</Title>
      
      <Card>
        <CenteredDiv>
          <Avatar size={120} src={user.avatarUrl} icon={<UserOutlined />} />
        </CenteredDiv>

        <Descriptions
          bordered
          column={1}
          size="middle"
          labelStyle={{ fontWeight: 'bold', width: '200px' }}
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
              {user.status.toUpperCase()}
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

export default ViewUser;
