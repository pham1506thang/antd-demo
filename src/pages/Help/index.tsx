import React from 'react';
import { Typography, Card, Collapse, Space, Button } from 'antd';
import { QuestionCircleOutlined, MessageOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

const HelpPage: React.FC = () => {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}>
        <QuestionCircleOutlined /> Help Center
      </Title>

      <Card title="Frequently Asked Questions">
        <Collapse defaultActiveKey={['1']}>
          <Panel header="How do I reset my password?" key="1">
            <Paragraph>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Paragraph>
          </Panel>
          <Panel header="How can I update my profile?" key="2">
            <Paragraph>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Paragraph>
          </Panel>
          <Panel header="Where can I find my order history?" key="3">
            <Paragraph>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Paragraph>
          </Panel>
        </Collapse>
      </Card>

      <Card title="Need More Help?">
        <Space direction="vertical" size="middle">
          <Paragraph>
            If you can't find the answer to your question in our FAQ, please contact our support team.
          </Paragraph>
          <Button type="primary" icon={<MessageOutlined />}>
            Contact Support
          </Button>
        </Space>
      </Card>
    </Space>
  );
};

export default HelpPage; 