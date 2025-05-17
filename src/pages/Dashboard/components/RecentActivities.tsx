import React from 'react';
import { Card, List, Avatar, Tag } from 'antd';
import { UserOutlined, ShoppingOutlined, MessageOutlined } from '@ant-design/icons';

const activities = [
  {
    id: 1,
    user: 'John Doe',
    action: 'placed an order',
    time: '2 minutes ago',
    type: 'order',
  },
  {
    id: 2,
    user: 'Jane Smith',
    action: 'left a review',
    time: '5 minutes ago',
    type: 'review',
  },
  {
    id: 3,
    user: 'Mike Johnson',
    action: 'registered',
    time: '10 minutes ago',
    type: 'user',
  },
  {
    id: 4,
    user: 'Sarah Wilson',
    action: 'sent a message',
    time: '15 minutes ago',
    type: 'message',
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case 'order':
      return <ShoppingOutlined />;
    case 'message':
      return <MessageOutlined />;
    default:
      return <UserOutlined />;
  }
};

const getTagColor = (type: string) => {
  switch (type) {
    case 'order':
      return 'blue';
    case 'review':
      return 'green';
    case 'message':
      return 'purple';
    default:
      return 'orange';
  }
};

const RecentActivities: React.FC = () => {
  return (
    <Card title="Recent Activities">
      <List
        itemLayout="horizontal"
        dataSource={activities}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar icon={getIcon(item.type)} />}
              title={item.user}
              description={
                <>
                  <Tag color={getTagColor(item.type)}>{item.type}</Tag>
                  {item.action}
                </>
              }
            />
            <div>{item.time}</div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default RecentActivities; 