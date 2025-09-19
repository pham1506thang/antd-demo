import React from 'react';
import { Typography, Card, Collapse, Space, Button } from 'antd';
import { QuestionCircleOutlined, MessageOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

const HelpPage: React.FC = () => {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}>
        <QuestionCircleOutlined /> Trung tâm trợ giúp
      </Title>

      <Card title="Câu hỏi thường gặp">
        <Collapse defaultActiveKey={['1']}>
          <Panel header="Làm thế nào để đặt lại mật khẩu?" key="1">
            <Paragraph>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Paragraph>
          </Panel>
          <Panel header="Làm thế nào để cập nhật hồ sơ?" key="2">
            <Paragraph>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Paragraph>
          </Panel>
          <Panel header="Tôi có thể tìm lịch sử đơn hàng ở đâu?" key="3">
            <Paragraph>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Paragraph>
          </Panel>
        </Collapse>
      </Card>

      <Card title="Cần thêm trợ giúp?">
        <Space direction="vertical" size="middle">
          <Paragraph>
            Nếu bạn không tìm thấy câu trả lời trong FAQ,
            vui lòng liên hệ với đội ngũ hỗ trợ của chúng tôi.
          </Paragraph>
          <Button type="primary" icon={<MessageOutlined />}>
            Liên hệ hỗ trợ
          </Button>
        </Space>
      </Card>
    </Space>
  );
};

export default HelpPage;
