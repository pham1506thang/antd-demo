import { USER_STATUS } from "@/models";

// Status color mapping
export const getUserStatusColor = (status: string) => {
  switch (status) {
    case USER_STATUS.ACTIVE:
      return 'green';
    case USER_STATUS.INACTIVE:
      return 'gray';
    case USER_STATUS.PENDING:
      return 'orange';
    case USER_STATUS.SUSPENDED:
      return 'red';
    default:
      return 'default';
  }
};

// Status display text mapping
export const getUserStatusText = (status: string) => {
  switch (status) {
    case USER_STATUS.ACTIVE:
      return 'Active';
    case USER_STATUS.INACTIVE:
      return 'Inactive';
    case USER_STATUS.PENDING:
      return 'Pending';
    case USER_STATUS.SUSPENDED:
      return 'Suspended';
    default:
      return status;
  }
};