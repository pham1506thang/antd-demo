import type { UserStatus } from '../user';

export interface CreateUserDTO {
  username: string;
  name?: string;
  email?: string;
  password: string;
  roles: string[];
  avatarUrl?: string;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  avatarUrl?: string;
  status?: UserStatus;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

export interface AssignRoleDTO {
  roles: string[];
}
