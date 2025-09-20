import React, { useMemo } from 'react';
import { Collapse, Row, Col, Checkbox, Space, Badge } from 'antd';
import { DOMAINS } from '@/models/permission';
import type { Permission } from '@/models/permission';
import { COLORS } from '@/constants/colors';

const { Panel } = Collapse;

interface PermissionDomainSelectorProps {
  permissions: Permission[];
  selectedPermissions: string[];
  onPermissionChange: (permissionId: string, checked: boolean) => void;
  onSelectAllDomain: (domain: string) => void;
  onDeselectAllDomain: (domain: string) => void;
}

const PermissionDomainSelector: React.FC<PermissionDomainSelectorProps> = ({
  permissions,
  selectedPermissions,
  onPermissionChange,
  onSelectAllDomain,
  onDeselectAllDomain,
}) => {
  const groupedPermissions = useMemo(() => {
    return Object.entries(DOMAINS).map(([key, domain]) => {
      const domainPermissions = permissions?.filter(p => p.domain === domain.value) || [];
      const selectedCount = domainPermissions.filter(p => selectedPermissions.includes(p.id)).length;
      
      return {
        domain: domain.value,
        domainLabel: key,
        permissions: domainPermissions,
        selectedCount,
        totalCount: domainPermissions.length,
      };
    }).filter(group => group.totalCount > 0); // Only show domains with permissions
  }, [permissions, selectedPermissions]);

  const handleDomainCheckAll = (domain: string, checked: boolean) => {
    if (checked) {
      onSelectAllDomain(domain);
    } else {
      onDeselectAllDomain(domain);
    }
  };

  return (
    <Collapse defaultActiveKey={groupedPermissions[0]?.domain}>
      {groupedPermissions.map((group) => (
        <Panel
          key={group.domain}
          header={
            <Space>
              <span style={{ fontWeight: 500 }}>{group.domainLabel}</span>
              <Badge 
                count={`${group.selectedCount}/${group.totalCount}`} 
                style={{ backgroundColor: group.selectedCount === group.totalCount ? COLORS.SUCCESS : COLORS.PRIMARY }}
              />
            </Space>
          }
          extra={
            <Checkbox
              checked={group.selectedCount === group.totalCount}
              indeterminate={group.selectedCount > 0 && group.selectedCount < group.totalCount}
              onChange={(e) => handleDomainCheckAll(group.domain, e.target.checked)}
            >
              {group.selectedCount === group.totalCount ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
            </Checkbox>
          }
        >
          <Row gutter={[8, 8]}>
            {group.permissions.map((permission) => (
              <Col span={8} key={permission.id}>
                <Checkbox
                  checked={selectedPermissions.includes(permission.id)}
                  onChange={(e) => onPermissionChange(permission.id, e.target.checked)}
                >
                  {permission.action.replace(/_/g, ' ').toUpperCase()}
                </Checkbox>
              </Col>
            ))}
          </Row>
        </Panel>
      ))}
    </Collapse>
  );
};

export default PermissionDomainSelector;
