import React from 'react';
import { Card, List, Tag, Typography, Space } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface Report {
  id: string;
  title: string;
  type: string;
  status: string;
  date: string;
}

const data: Report[] = [
  {
    id: 'REP-001',
    title: 'Monthly Sales Report',
    type: 'Sales',
    status: 'completed',
    date: '2024-03-21',
  },
  {
    id: 'REP-002',
    title: 'Customer Satisfaction Survey',
    type: 'Customer',
    status: 'in_progress',
    date: '2024-03-20',
  },
  {
    id: 'REP-003',
    title: 'Inventory Analysis',
    type: 'Inventory',
    status: 'pending',
    date: '2024-03-19',
  },
  {
    id: 'REP-004',
    title: 'Marketing Campaign Results',
    type: 'Marketing',
    status: 'completed',
    date: '2024-03-18',
  },
  {
    id: 'REP-005',
    title: 'Employee Performance Review',
    type: 'HR',
    status: 'in_progress',
    date: '2024-03-17',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'in_progress':
      return 'processing';
    case 'pending':
      return 'warning';
    default:
      return 'default';
  }
};

const ReportsList: React.FC = () => {
  return (
    <Card title="Báo cáo gần đây">
      <List
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <div style={{ width: '100%' }}>
              <Space
                align="start"
                style={{ width: '100%', justifyContent: 'space-between' }}
              >
                <div>
                  <Space>
                    <FileTextOutlined />
                    <div>
                      <Text strong>{item.title}</Text>
                      <div>
                        <Text type="secondary">{item.id}</Text>
                        <Tag style={{ marginLeft: 8 }}>{item.type}</Tag>
                      </div>
                    </div>
                  </Space>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Tag color={getStatusColor(item.status)}>
                    {item.status.replace('_', ' ').toUpperCase()}
                  </Tag>
                  <div>
                    <Text type="secondary">{item.date}</Text>
                  </div>
                </div>
              </Space>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default ReportsList;
