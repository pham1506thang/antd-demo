import type { Role } from "./role";

export type User<TRole extends Role | string = string> = {
  id?: string;
  username: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  lastLogin?: string;
  roles: TRole[];
  createdAt?: string;
  updatedAt?: string;
}