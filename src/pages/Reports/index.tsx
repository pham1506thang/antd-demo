import React from 'react';
import { Typography, Space, Row, Col } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import ReportsList from './components/ReportsList';
import ReportsSummary from './components/ReportsSummary';
import ReportsChart from './components/ReportsChart';

const { Title } = Typography;

const ReportsPage: React.FC = () => {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}>
        <FileTextOutlined /> Reports
      </Title>

      <ReportsSummary />

      <Row gutter={[16, 16]}>
        <Col span={16}>
          <ReportsChart />
        </Col>
        <Col span={8}>
          <ReportsList />
        </Col>
      </Row>
    </Space>
  );
};

export default ReportsPage; 