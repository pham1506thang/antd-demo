import type { Role } from "./role";

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  SUSPENDED: 'suspended',
} as const;

export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];

export type User<TRole extends Role | string = string> = {
  id?: string;
  username: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  lastLogin?: string;
  status: UserStatus;
  roles: TRole[];
  createdAt?: string;
  updatedAt?: string;
}