import React from 'react';
import { Card, Collapse, Space, Button, Typography } from 'antd';
import { QuestionCircleOutlined, MessageOutlined } from '@ant-design/icons';
import { TitleWithoutMargin } from '@/components';

const { Paragraph } = Typography;

export const HelpPage: React.FC = () => {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <TitleWithoutMargin level={2} icon={<QuestionCircleOutlined />}>
        Trung tâm trợ giúp
      </TitleWithoutMargin>

      <Card title="Câu hỏi thường gặp">
        <Collapse 
          defaultActiveKey={['1']}
          items={[
            {
              key: '1',
              label: 'Làm thế nào để đặt lại mật khẩu?',
              children: (
                <Paragraph>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                  eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </Paragraph>
              ),
            },
            {
              key: '2',
              label: 'Làm thế nào để cập nhật hồ sơ?',
              children: (
                <Paragraph>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                  eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </Paragraph>
              ),
            },
            {
              key: '3',
              label: 'Tôi có thể tìm lịch sử đơn hàng ở đâu?',
              children: (
                <Paragraph>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                  eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </Paragraph>
              ),
            },
          ]}
        />
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

