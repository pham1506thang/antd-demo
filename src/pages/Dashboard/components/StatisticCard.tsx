import React from 'react';
import { Card, Statistic } from 'antd';

interface StatisticCardProps {
  title: string;
  value: number;
  prefix?: string | React.ReactNode;
  precision?: number;
  icon?: React.ReactNode;
}

export const StatisticCard: React.FC<StatisticCardProps> = ({
  title,
  value,
  prefix,
  precision,
  icon,
}) => {
  return (
    <Card>
      <Statistic
        title={title}
        value={value}
        prefix={icon || prefix}
        precision={precision}
      />
    </Card>
  );
};

