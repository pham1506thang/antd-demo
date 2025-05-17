import type { Permission } from "./permission";


export type Role = {
  _id: string;
  code: string;
  label: string;
  isAdmin: boolean;
  isProtected: boolean;
  permissions: Permission[];
  createdAt?: Date;
  updatedAt?: Date;
}