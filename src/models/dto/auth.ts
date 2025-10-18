export interface AuthLoginDTO {
  username: string;
  password: string;
}

export interface AuthUpdateProfileDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  avatarUrl?: string;
  thumbnailAvatarUrl?: string;
}

export interface AuthChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}