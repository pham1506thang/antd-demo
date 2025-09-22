import { TAG_COLORS } from '@/constants/colors';

// Role protection status color mapping
export const getRoleProtectionColor = (isProtected: boolean) => {
  return isProtected ? TAG_COLORS.WARNING : TAG_COLORS.SUCCESS;
};

// Role protection status display text mapping
export const getRoleProtectionText = (isProtected: boolean) => {
  return isProtected ? 'Có' : 'Không';
};

// Role protection status description mapping
export const getRoleProtectionDescription = (isProtected: boolean) => {
  return isProtected 
    ? 'Vai trò này được bảo vệ và không thể chỉnh sửa vì lý do bảo mật hệ thống.'
    : 'Vai trò này có thể được chỉnh sửa bình thường.';
};

