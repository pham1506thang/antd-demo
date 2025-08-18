import type { Permission } from './permission';

export type Role = {
  id: string;
  code: string;
  label: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isProtected: boolean;
  permissions: Permission[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type SummaryRole = Pick<
  Role,
  'id' | 'code' | 'label' | 'isAdmin' | 'isSuperAdmin' | 'isProtected'
>;
