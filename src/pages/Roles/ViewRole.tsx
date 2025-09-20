import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Card, Space, Button, Descriptions, Tag, Collapse, Row, Col, Badge } from 'antd';
import { ArrowLeftOutlined, EditOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useGetRoleQuery } from '@/api/slices/roleApi';
import { DOMAINS } from '@/models/permission';
import { isApiError } from '@/models/error';
import { getRoleProtectionColor, getRoleProtectionText, getRoleProtectionDescription, getRoleProtectionIconColor } from '@/helpers/role';
import { COLORS } from '@/constants/colors';
import LoadingView from '@/components/LoadingView';
import ErrorView from '@/components/ErrorView';
import styled from 'styled-components';

const { Title, Text } = Typography;

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

const PermissionSection = styled.div`
  margin-top: 16px;
`;

const ViewRole: React.FC = () => {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();

  // Fetch role data
  const { data: role, isLoading, error } = useGetRoleQuery(roleId!, {
    skip: !roleId,
  });

  const handleEdit = () => {
    navigate(`/${DOMAINS.ROLES.value}/update/${roleId}`);
  };

  const handleBack = () => {
    navigate(`/${DOMAINS.ROLES.value}`);
  };

  if (isLoading) {
    return <LoadingView message="Đang tải thông tin vai trò..." />;
  }

  if (error || !role) {
    // Extract status code from error, default to 404 if no role data
    const statusCode = error && isApiError(error) ? error.statusCode : 404;
    
    return (
      <ErrorView
        status={statusCode}
        onBack={handleBack}
        backButtonText="Quay lại danh sách"
      />
    );
  }

  // Group permissions by domain with count
  const groupedPermissions = role.permissions.reduce((acc, permission) => {
    const domain = permission.domain;
    if (!acc[domain]) {
      acc[domain] = {
        domain,
        domainLabel: domain.charAt(0).toUpperCase() + domain.slice(1),
        permissions: [],
        totalCount: 0
      };
    }
    acc[domain].permissions.push(permission);
    acc[domain].totalCount++;
    return acc;
  }, {} as Record<string, {
    domain: string;
    domainLabel: string;
    permissions: typeof role.permissions;
    totalCount: number;
  }>);

  const groupedPermissionsArray = Object.values(groupedPermissions);

  // Create collapse items for the new API
  const collapseItems = groupedPermissionsArray.map((group) => ({
    key: group.domain,
    label: (
      <Space>
        <span style={{ fontWeight: 500 }}>{group.domainLabel}</span>
        <Badge 
          count={group.totalCount} 
          style={{ backgroundColor: COLORS.SUCCESS }}
        />
      </Space>
    ),
    children: (
      <Row gutter={[8, 8]}>
        {group.permissions.map((permission) => (
          <Col span={4} key={permission.id}>
            <Tag color="blue" style={{ marginBottom: '8px' }}>
              {permission.action.replace(/_/g, ' ').toUpperCase()}
            </Tag>
          </Col>
        ))}
      </Row>
    ),
  }));

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <ButtonContainer>
        <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
          Quay lại danh sách
        </Button>
        {!role.isProtected && (
          <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
            Chỉnh sửa
          </Button>
        )}
      </ButtonContainer>

      <Title level={2}>Chi tiết vai trò</Title>
      
      <Card>
        <CenteredDiv>
          <SafetyCertificateOutlined 
            style={{ 
              fontSize: '120px', 
              color: getRoleProtectionIconColor(role.isProtected)
            }} 
          />
        </CenteredDiv>

        <Descriptions
          bordered
          column={1}
          size="middle"
          styles={{
            label: {
              fontWeight: 'bold',
              width: '200px'
            }
          }}
        >
          <Descriptions.Item label="Tên vai trò">
            {role.label}
          </Descriptions.Item>
          
          <Descriptions.Item label="Mô tả">
            {role.description || 'Không có mô tả'}
          </Descriptions.Item>
          
          <Descriptions.Item label="Trạng thái">
            <Tag color={getRoleProtectionColor(role.isProtected)}>
              {getRoleProtectionText(role.isProtected)}
            </Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label="Số quyền">
            <Tag color="blue">
              {role.isSuperAdmin ? 'Tất cả' : `${role.permissions.length} quyền`}
            </Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label="Ngày tạo">
            {role.createdAt ? new Date(role.createdAt).toLocaleString() : 'N/A'}
          </Descriptions.Item>
          
          <Descriptions.Item label="Ngày cập nhật">
            {role.updatedAt ? new Date(role.updatedAt).toLocaleString() : 'N/A'}
          </Descriptions.Item>
        </Descriptions>

        {role.isSuperAdmin ? (
          <PermissionSection>
            <Title level={4}>Quyền hạn</Title>
            <div style={{ 
              padding: '16px', 
              background: COLORS.BG_SUCCESS, 
              border: `1px solid ${COLORS.BORDER_SUCCESS}`, 
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <Text strong style={{ color: COLORS.SUCCESS, fontSize: '16px' }}>
                Super Admin có tất cả quyền trong hệ thống
              </Text>
            </div>
          </PermissionSection>
        ) : role.permissions.length > 0 && (
          <PermissionSection>
            <Title level={4}>Danh sách quyền</Title>
            <Collapse 
              defaultActiveKey={groupedPermissionsArray[0]?.domain}
              items={collapseItems}
            />
          </PermissionSection>
        )}

        {role.isProtected && (
          <div style={{ marginTop: '24px', padding: '16px', background: '#fff7e6', border: '1px solid #ffd591', borderRadius: '6px' }}>
            <Text type="warning">
              <SafetyCertificateOutlined style={{ marginRight: '8px' }} />
              {getRoleProtectionDescription(role.isProtected)}
            </Text>
          </div>
        )}
      </Card>
    </Space>
  );
};

export default ViewRole;
