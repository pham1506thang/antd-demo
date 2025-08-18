import React from 'react';
import { Card, List, Tag, Typography } from 'antd';
import { LinkOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface PageData {
  url: string;
  views: number;
  change: number;
}

const data: PageData[] = [
  {
    url: '/dashboard',
    views: 4521,
    change: 12.3,
  },
  {
    url: '/products',
    views: 3726,
    change: -5.4,
  },
  {
    url: '/users',
    views: 2891,
    change: 8.7,
  },
  {
    url: '/analytics',
    views: 2458,
    change: 15.2,
  },
  {
    url: '/settings',
    views: 1832,
    change: 3.1,
  },
];

const TopPages: React.FC = () => {
  return (
    <Card title="Top Pages">
      <List
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <div style={{ width: '100%' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: 4,
                }}
              >
                <LinkOutlined style={{ marginRight: 8 }} />
                <Text strong>{item.url}</Text>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text type="secondary">
                  {item.views.toLocaleString()} views
                </Text>
                <Tag color={item.change >= 0 ? 'success' : 'error'}>
                  {item.change >= 0 ? '+' : ''}
                  {item.change}%
                </Tag>
              </div>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default TopPages;
