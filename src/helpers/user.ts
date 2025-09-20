import { USER_STATUS } from '@/models';
import { TAG_COLORS } from '@/constants/colors';

// Status color mapping
export const getUserStatusColor = (status: string) => {
  switch (status) {
    case USER_STATUS.ACTIVE:
      return TAG_COLORS.GREEN;
    case USER_STATUS.INACTIVE:
      return TAG_COLORS.DEFAULT;
    case USER_STATUS.PENDING:
      return TAG_COLORS.ORANGE;
    case USER_STATUS.SUSPENDED:
      return TAG_COLORS.RED;
    default:
      return TAG_COLORS.DEFAULT;
  }
};

// Status display text mapping
export const getUserStatusText = (status: string) => {
  switch (status) {
    case USER_STATUS.ACTIVE:
      return 'Hoạt động';
    case USER_STATUS.INACTIVE:
      return 'Không hoạt động';
    case USER_STATUS.PENDING:
      return 'Chờ duyệt';
    case USER_STATUS.SUSPENDED:
      return 'Bị đình chỉ';
    default:
      return status;
  }
};
