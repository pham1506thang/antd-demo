import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/models';
import type { AuthResponse, Permission } from '@/models';

export interface AuthState {
  me: User | null;
  permissions: Permission[];
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  me: null,
  permissions: [],
  isAdmin: false,
  isSuperAdmin: false,
  isAuthenticated: false,
};

const sliceName = 'auth';

const buildAuthState = (state: AuthResponse): AuthState => ({
  ...state,
  isAdmin: state.me.roles.some((role) => role.isAdmin),
  isSuperAdmin: state.me.roles.some((role) => role.isSuperAdmin),
  isAuthenticated: true,
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth: () => {
      return {
        me: null,
        permissions: [],
        isAdmin: false,
        isSuperAdmin: false,
        isAuthenticated: false,
      };
    },
    setAuth: (_, action: PayloadAction<AuthResponse>): AuthState => {
      return buildAuthState(action.payload);
    },
    updateUser: (state, action: PayloadAction<Partial<User>>): AuthState => {
      return buildAuthState({
        me: { ...state.me, ...action.payload as User },
        permissions: state.permissions,
      });
    },
  },
});

export const { clearAuth, setAuth, updateUser } = authSlice.actions;

export const meSelector = (state: { [sliceName]: AuthState }) =>
  state[sliceName].me;
export const permissionsSelector = (state: { [sliceName]: AuthState }) =>
  state[sliceName].permissions;
export const isAuthenticatedSelector = (state: { [sliceName]: AuthState }) =>
  state[sliceName].isAuthenticated;
export const isAdminSelector = (state: { [sliceName]: AuthState }) =>
  state[sliceName].isAdmin;
export const isSuperAdminSelector = (state: { [sliceName]: AuthState }) =>
  state[sliceName].isSuperAdmin;

export default authSlice.reducer;
