import React from 'react';
import { Card } from 'antd';
import { Line } from '@ant-design/plots';

const data = [
  { month: 'Jan', sales: 3500 },
  { month: 'Feb', sales: 4200 },
  { month: 'Mar', sales: 3800 },
  { month: 'Apr', sales: 4800 },
  { month: 'May', sales: 5200 },
  { month: 'Jun', sales: 4900 },
  { month: 'Jul', sales: 5800 },
  { month: 'Aug', sales: 6300 },
  { month: 'Sep', sales: 5900 },
  { month: 'Oct', sales: 6800 },
  { month: 'Nov', sales: 7200 },
  { month: 'Dec', sales: 8000 },
];

const SalesChart: React.FC = () => {
  const config = {
    data,
    xField: 'month',
    yField: 'sales',
    smooth: true,
    point: {
      size: 4,
      shape: 'circle',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
  };

  return (
    <Card title="Tổng quan doanh số">
      <Line {...config} />
    </Card>
  );
};

export default SalesChart;
