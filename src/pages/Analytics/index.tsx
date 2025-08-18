import React from 'react';
import { Typography, Row, Col, Space } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import VisitorStats from './components/VisitorStats';
import TrafficChart from './components/TrafficChart';
import TopPages from './components/TopPages';

const { Title } = Typography;

const AnalyticsPage: React.FC = () => {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}>
        <BarChartOutlined /> Analytics
      </Title>

      <VisitorStats />

      <Row gutter={[16, 16]}>
        <Col span={16}>
          <TrafficChart />
        </Col>
        <Col span={8}>
          <TopPages />
        </Col>
      </Row>
    </Space>
  );
};

export default AnalyticsPage;
