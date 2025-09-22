export const USER_FORM_ACTIONS = {
  CREATE: 'create',
  UPDATE_INFO: 'update-info',
  CHANGE_PASSWORD: 'change-password',
  ASSIGN_ROLE: 'assign-role',
} as const;

export type UserFormAction =
  (typeof USER_FORM_ACTIONS)[keyof typeof USER_FORM_ACTIONS];
