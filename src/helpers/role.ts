import { TAG_COLORS, STATE_COLORS } from '@/constants/colors';

// Role protection status color mapping
export const getRoleProtectionColor = (isProtected: boolean) => {
  return isProtected ? TAG_COLORS.WARNING : TAG_COLORS.SUCCESS;
};

// Role protection icon color mapping
export const getRoleProtectionIconColor = (isProtected: boolean) => {
  return isProtected ? STATE_COLORS.ROLE_PROTECTED : STATE_COLORS.ROLE_NORMAL;
};

// Role protection status display text mapping
export const getRoleProtectionText = (isProtected: boolean) => {
  return isProtected ? 'ĐƯỢC BẢO VỆ' : 'BÌNH THƯỜNG';
};

// Role protection status description mapping
export const getRoleProtectionDescription = (isProtected: boolean) => {
  return isProtected 
    ? 'Vai trò này được bảo vệ và không thể chỉnh sửa vì lý do bảo mật hệ thống.'
    : 'Vai trò này có thể được chỉnh sửa bình thường.';
};

// Role admin status color mapping (for future use)
export const getRoleAdminColor = (isAdmin: boolean) => {
  return isAdmin ? 'red' : 'default';
};

// Role admin status display text mapping (for future use)
export const getRoleAdminText = (isAdmin: boolean) => {
  return isAdmin ? 'ADMIN' : 'USER';
};

// Role super admin status color mapping (for future use)
export const getRoleSuperAdminColor = (isSuperAdmin: boolean) => {
  return isSuperAdmin ? 'purple' : 'default';
};

// Role super admin status display text mapping (for future use)
export const getRoleSuperAdminText = (isSuperAdmin: boolean) => {
  return isSuperAdmin ? 'SUPER ADMIN' : 'ADMIN';
};
