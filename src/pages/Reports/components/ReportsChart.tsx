import React from 'react';
import { Card } from 'antd';
import { Column } from '@ant-design/plots';

const data = [
  { month: 'Jan', completed: 45, inProgress: 12, pending: 8 },
  { month: 'Feb', completed: 52, inProgress: 15, pending: 10 },
  { month: 'Mar', completed: 61, inProgress: 18, pending: 7 },
  { month: 'Apr', completed: 48, inProgress: 14, pending: 9 },
  { month: 'May', completed: 55, inProgress: 20, pending: 12 },
  { month: 'Jun', completed: 67, inProgress: 16, pending: 8 },
];

const ReportsChart: React.FC = () => {
  // Transform data for stacked column chart
  const transformedData = data.reduce((acc, item) => {
    acc.push(
      { month: item.month, type: 'Completed', value: item.completed },
      { month: item.month, type: 'In Progress', value: item.inProgress },
      { month: item.month, type: 'Pending', value: item.pending }
    );
    return acc;
  }, [] as any[]);

  const config = {
    data: transformedData,
    isStack: true,
    xField: 'month',
    yField: 'value',
    seriesField: 'type',
    label: {
      position: 'middle',
    },
    color: ['#52c41a', '#1677ff', '#faad14'],
  };

  return (
    <Card title="Reports Overview">
      <Column {...config} />
    </Card>
  );
};

export default ReportsChart; 