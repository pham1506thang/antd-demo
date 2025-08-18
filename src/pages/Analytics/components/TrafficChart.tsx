import React from 'react';
import { Card } from 'antd';
import { Line } from '@ant-design/plots';

const data = [
  { date: '2024-03-15', visitors: 2500, pageViews: 5800 },
  { date: '2024-03-16', visitors: 2800, pageViews: 6200 },
  { date: '2024-03-17', visitors: 2100, pageViews: 4900 },
  { date: '2024-03-18', visitors: 3200, pageViews: 7100 },
  { date: '2024-03-19', visitors: 3800, pageViews: 8300 },
  { date: '2024-03-20', visitors: 3500, pageViews: 7800 },
  { date: '2024-03-21', visitors: 3900, pageViews: 8600 },
];

const TrafficChart: React.FC = () => {
  const config = {
    data,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
  };

  // Transform data for multiple lines
  const transformedData = data.reduce((acc, item) => {
    acc.push(
      { date: item.date, type: 'Visitors', value: item.visitors },
      { date: item.date, type: 'Page Views', value: item.pageViews }
    );
    return acc;
  }, [] as any[]);

  return (
    <Card title="Traffic Overview">
      <Line {...config} data={transformedData} />
    </Card>
  );
};

export default TrafficChart;
