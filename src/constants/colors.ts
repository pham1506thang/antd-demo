// Ant Design color palette constants
// These colors are designed to work well with Ant Design components

export const COLORS = {
  // Primary colors
  PRIMARY: '#1890ff',
  PRIMARY_HOVER: '#40a9ff',
  PRIMARY_ACTIVE: '#096dd9',
  
  // Success colors
  SUCCESS: '#52c41a',
  SUCCESS_HOVER: '#73d13d',
  SUCCESS_ACTIVE: '#389e0d',
  
  // Warning colors
  WARNING: '#faad14',
  WARNING_HOVER: '#ffc53d',
  WARNING_ACTIVE: '#d48806',
  
  // Error colors
  ERROR: '#ff4d4f',
  ERROR_HOVER: '#ff7875',
  ERROR_ACTIVE: '#d9363e',
  
  // Info colors
  INFO: '#13c2c2',
  INFO_HOVER: '#36cfc9',
  INFO_ACTIVE: '#08979c',
  
  // Neutral colors
  DEFAULT: '#d9d9d9',
  DEFAULT_HOVER: '#e6f7ff',
  DEFAULT_ACTIVE: '#bae7ff',
  
  // Gray scale
  GRAY_1: '#ffffff',
  GRAY_2: '#fafafa',
  GRAY_3: '#f5f5f5',
  GRAY_4: '#f0f0f0',
  GRAY_5: '#d9d9d9',
  GRAY_6: '#bfbfbf',
  GRAY_7: '#8c8c8c',
  GRAY_8: '#595959',
  GRAY_9: '#434343',
  GRAY_10: '#262626',
  GRAY_11: '#1f1f1f',
  GRAY_12: '#141414',
  GRAY_13: '#000000',
  
  // Special colors
  PURPLE: '#722ed1',
  PURPLE_HOVER: '#9254de',
  PURPLE_ACTIVE: '#531dab',
  
  // Background colors
  BG_WARNING: '#fff7e6',
  BG_ERROR: '#fff2f0',
  BG_SUCCESS: '#f6ffed',
  BG_INFO: '#e6f7ff',
  
  // Border colors
  BORDER_WARNING: '#ffd591',
  BORDER_ERROR: '#ffccc7',
  BORDER_SUCCESS: '#b7eb8f',
  BORDER_INFO: '#91d5ff',
} as const;

// Color mapping for different states
export const STATE_COLORS = {
  // User status colors
  USER_ACTIVE: COLORS.SUCCESS,
  USER_INACTIVE: COLORS.GRAY_5,
  USER_PENDING: COLORS.WARNING,
  USER_SUSPENDED: COLORS.ERROR,
  
  // Role protection colors
  ROLE_PROTECTED: COLORS.WARNING,
  ROLE_NORMAL: COLORS.SUCCESS,
  
  // Permission colors
  PERMISSION_GRANTED: COLORS.SUCCESS,
  PERMISSION_DENIED: COLORS.GRAY_5,
  
  // Action colors
  ACTION_EDIT: COLORS.PRIMARY,
  ACTION_DELETE: COLORS.ERROR,
  ACTION_VIEW: COLORS.INFO,
  ACTION_CREATE: COLORS.SUCCESS,
} as const;

// Ant Design Tag color mapping
export const TAG_COLORS = {
  // Status colors
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  INFO: 'processing',
  DEFAULT: 'default',
  
  // Custom colors
  BLUE: 'blue',
  GREEN: 'green',
  RED: 'red',
  ORANGE: 'orange',
  PURPLE: 'purple',
  CYAN: 'cyan',
  MAGENTA: 'magenta',
  LIME: 'lime',
  GOLD: 'gold',
  VOLCANO: 'volcano',
  GEEKBLUE: 'geekblue',
} as const;
