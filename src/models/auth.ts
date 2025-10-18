import type { Permission } from './permission';
import type { User } from './user';

export interface AuthResponse {
  me: User;
  permissions: Permission[];
}

export interface LoginResponse {
  accessToken: string;
}