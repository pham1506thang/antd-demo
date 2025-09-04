export interface CreateRoleDTO {
  code: string;
  label: string;
  description?: string;
  permissions: string[];
}

export interface UpdateRoleDTO {
  label?: string;
  description?: string;
  permissions: string[];
}