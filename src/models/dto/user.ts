import type { UserStatus } from '../user';

export interface CreateUserDTO {
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password: string;
  roles: string[];
  avatarUrl?: string;
  thumbnailAvatarUrl?: string;
}

export interface UpdateUserDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  avatarUrl?: string;
  thumbnailAvatarUrl?: string;
  status?: UserStatus;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

export interface AssignRoleDTO {
  roles: string[];
}
