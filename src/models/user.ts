import type { SummaryRole } from "./role";

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  SUSPENDED: 'suspended',
} as const;

export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];

export type User = {
  id?: string;
  username: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  lastLogin?: string;
  status: UserStatus;
  roles: SummaryRole[];
  createdAt?: string;
  updatedAt?: string;
}