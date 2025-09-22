import React from 'react';
import { Row, Col, Space } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import { VisitorStats } from './components/VisitorStats';
import { TrafficChart } from './components/TrafficChart';
import { TopPages } from './components/TopPages';
import { TitleWithoutMargin } from '@/components';

export const AnalyticsPage: React.FC = () => {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <TitleWithoutMargin level={2} icon={<BarChartOutlined />}>
        Analytics
      </TitleWithoutMargin>

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

