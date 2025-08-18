import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  UserAddOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';

const UserStats: React.FC = () => {
  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card>
          <Statistic
            title="Total Users"
            value={1234}
            prefix={<UserOutlined />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Active Users"
            value={892}
            prefix={<TeamOutlined />}
            valueStyle={{ color: '#3f8600' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="New Users (Today)"
            value={12}
            prefix={<UserAddOutlined />}
            valueStyle={{ color: '#1677ff' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Inactive Users"
            value={342}
            prefix={<UserSwitchOutlined />}
            valueStyle={{ color: '#cf1322' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default UserStats;
