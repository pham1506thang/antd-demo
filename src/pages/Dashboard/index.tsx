import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import StatisticCard from './components/StatisticCard';
import RecentActivities from './components/RecentActivities';
import SalesChart from './components/SalesChart';

const Dashboard: React.FC = () => {
  return (
    <div>
      <h2>Dashboard</h2>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <StatisticCard
            title="Active Users"
            value={1128}
            icon={<UserOutlined />}
          />
        </Col>
        <Col span={8}>
          <StatisticCard
            title="Orders"
            value={93}
            icon={<ShoppingCartOutlined />}
          />
        </Col>
        <Col span={8}>
          <StatisticCard
            title="Revenue"
            value={15600}
            prefix="$"
            precision={2}
            icon={<DollarOutlined />}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col span={16}>
          <SalesChart />
        </Col>
        <Col span={8}>
          <RecentActivities />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
