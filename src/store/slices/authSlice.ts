import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from 'models/user';
import type { Permission } from '@/models';

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

export const buildAuthState = (state: {
  me: User;
  permissions: Permission[];
}): AuthState => ({
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
    setAuth: (state, action: PayloadAction<AuthState>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { clearAuth, setAuth } = authSlice.actions;

export const meSelector = (state: { [sliceName]: AuthState }) =>
  state[sliceName].me;
export const permissionsSelector = (state: { [sliceName]: AuthState }) =>
  state[sliceName].permissions;
export const isAuthenticatedSelector = (state: { [sliceName]: AuthState }) =>
  state[sliceName].isAuthenticated;

export default authSlice.reducer;
