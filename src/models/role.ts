import type { BaseModel } from './base';
import type { Permission } from './permission';

export interface Role extends BaseModel {
  code: string;
  label: string;
  description?: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isProtected: boolean;
  permissions: Permission[];
}

export type SummaryRole = Pick<
  Role,
  'id' | 'code' | 'label' | 'isAdmin' | 'isSuperAdmin' | 'isProtected'
>;
