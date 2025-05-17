import React from 'react';
import { Typography, Card, Table, Tag, Space } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface Order {
  key: string;
  orderNumber: string;
  customer: string;
  amount: number;
  status: string;
  date: string;
}

const mockData: Order[] = [
  {
    key: '1',
    orderNumber: 'ORD-001',
    customer: 'John Doe',
    amount: 150.00,
    status: 'completed',
    date: '2024-03-20',
  },
  {
    key: '2',
    orderNumber: 'ORD-002',
    customer: 'Jane Smith',
    amount: 89.99,
    status: 'pending',
    date: '2024-03-21',
  },
];

const OrdersPage: React.FC = () => {
  const columns = [
    {
      title: 'Order Number',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `$${amount.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'completed' ? 'success' : 'processing'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}>
        <ShoppingCartOutlined /> Orders
      </Title>
      <Card>
        <Table columns={columns} dataSource={mockData} />
      </Card>
    </Space>
  );
};

export default OrdersPage; 