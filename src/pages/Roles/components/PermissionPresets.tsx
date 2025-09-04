import React from 'react';
import { Row, Col, Card, Typography, Badge, Space } from 'antd';
import type { Permission } from '@/models/permission';

const { Title, Text } = Typography;

interface PermissionPreset {
  name: string;
  description: string;
  permissions: string[];
}

interface PermissionPresetsProps {
  permissions: Permission[];
  onPresetSelect: (permissionIds: string[]) => void;
}

const PermissionPresets: React.FC<PermissionPresetsProps> = ({
  permissions,
  onPresetSelect,
}) => {
  // Generate presets based on available permissions
  const presets: PermissionPreset[] = [
    {
      name: "Admin",
      description: "Full access to all features",
      permissions: permissions?.map(p => p.id) || [],
    },
    {
      name: "Editor", 
      description: "Content management access",
      permissions: permissions?.filter(p => 
        p.domain === 'articles' || 
        p.domain === 'categories' || 
        p.domain === 'tags' ||
        p.domain === 'medias'
      ).map(p => p.id) || [],
    },
    {
      name: "Viewer",
      description: "Read-only access",
      permissions: permissions?.filter(p => 
        p.action === 'view' || 
        p.action === 'view_all' || 
        p.action === 'view_profile' ||
        p.action === 'view_summary'
      ).map(p => p.id) || [],
    },
    {
      name: "Moderator",
      description: "Content moderation access", 
      permissions: permissions?.filter(p => 
        p.action === 'moderate' || 
        p.action === 'review' ||
        p.action === 'delete_own' ||
        p.action === 'edit_own' ||
        p.action === 'view'
      ).map(p => p.id) || [],
    },
    {
      name: "User Manager",
      description: "User management access",
      permissions: permissions?.filter(p => 
        p.domain === 'users' || p.domain === 'roles'
      ).map(p => p.id) || [],
    },
    {
      name: "Analytics",
      description: "Analytics and reports access",
      permissions: permissions?.filter(p => 
        p.domain === 'analytics' || 
        p.domain === 'reports' ||
        p.action === 'access'
      ).map(p => p.id) || [],
    },
  ];

  const handlePresetClick = (preset: PermissionPreset) => {
    onPresetSelect(preset.permissions);
  };

  return (
    <Row gutter={[16, 16]}>
      {presets.map((preset) => (
        <Col span={12} key={preset.name}>
          <Card 
            hoverable
            onClick={() => handlePresetClick(preset)}
            style={{ 
              textAlign: 'center',
              cursor: 'pointer',
              height: '100%',
            }}
            styles={{ body: { padding: '20px' } }}
          >
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Title level={4} style={{ margin: 0 }}>
                {preset.name}
              </Title>
              <Text type="secondary" style={{ fontSize: '14px' }}>
                {preset.description}
              </Text>
              <Badge 
                count={preset.permissions.length} 
                style={{ 
                  backgroundColor: '#1890ff',
                  fontSize: '12px',
                }}
              />
            </Space>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default PermissionPresets;
