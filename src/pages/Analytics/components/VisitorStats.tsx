import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { UserOutlined, EyeOutlined, FieldTimeOutlined, RiseOutlined } from '@ant-design/icons';

const VisitorStats: React.FC = () => {
  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card>
          <Statistic
            title="Total Visitors"
            value={15234}
            prefix={<UserOutlined />}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Page Views"
            value={45678}
            prefix={<EyeOutlined />}
            valueStyle={{ color: '#1677ff' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Avg. Time on Site"
            value="4:23"
            prefix={<FieldTimeOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Bounce Rate"
            value={32.8}
            prefix={<RiseOutlined />}
            suffix="%"
            precision={1}
            valueStyle={{ color: '#faad14' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default VisitorStats; 