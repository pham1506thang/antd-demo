import React from 'react';
import { Typography } from 'antd';
import type { TitleProps } from 'antd/es/typography/Title';

const { Title: AntTitle } = Typography;

interface TitleWithoutMarginProps extends Omit<TitleProps, 'level'> {
  level?: 1 | 2 | 3 | 4 | 5;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const TitleWithoutMargin: React.FC<TitleWithoutMarginProps> = ({
  level = 2,
  children,
  icon,
  style,
  ...props
}) => {
  return (
    <AntTitle
      level={level}
      style={{ margin: 0, ...style }}
      {...props}
    >
      {icon && <>{icon} </>}
      {children}
    </AntTitle>
  );
};