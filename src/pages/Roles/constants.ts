export const ROLE_FORM_ACTIONS = {
  CREATE: 'create',
  UPDATE_INFO: 'update-info',
  UPDATE_PERMISSIONS: 'update-permissions',
} as const;

export type RoleFormAction =
  (typeof ROLE_FORM_ACTIONS)[keyof typeof ROLE_FORM_ACTIONS];
