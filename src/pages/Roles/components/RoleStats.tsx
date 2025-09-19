import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import {
  SafetyCertificateOutlined,
  LockOutlined,
  SafetyOutlined,
  ApiOutlined,
} from '@ant-design/icons';

const RoleStats: React.FC = () => {
  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card>
          <Statistic
            title="Tổng vai trò"
            value={24}
            prefix={<SafetyCertificateOutlined />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Vai trò Admin"
            value={3}
            prefix={<LockOutlined />}
            valueStyle={{ color: '#3f8600' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Vai trò được bảo vệ"
            value={5}
            prefix={<SafetyOutlined />}
            valueStyle={{ color: '#1677ff' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Vai trò người dùng"
            value={16}
            prefix={<ApiOutlined />}
            valueStyle={{ color: '#cf1322' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default RoleStats;