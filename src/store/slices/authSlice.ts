import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from 'models/user';
import { authApi } from 'api/slices/authApi';
import { userApi } from '@/api/slices/userApi';
import type { Permission } from '@/models';

export interface AuthState {
  me: User | null;
  permissions: Permission[];
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const initialState: AuthState = {
  me: null,
  permissions: [],
  isAdmin: false,
  isSuperAdmin: false,
};

const sliceName = 'auth';

export const buildAuthState = (state: {
  me: User;
  permissions: Permission[];
}): AuthState => ({
  ...state,
  isAdmin: state.me.roles.some((role) => role.isAdmin),
  isSuperAdmin: state.me.roles.some((role) => role.isSuperAdmin),
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
      };
    },
    setAuth: (state, action: PayloadAction<AuthState>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        userApi.endpoints.updateUser.matchFulfilled,
        (state, { payload }) => {
          if (state.me && payload) {
            return {
              ...state,
              me: {
                ...state.me,
                ...payload,
                roles: state.me.roles,
              },
            };
          }

          return state;
        }
      )
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.me = null;
        state.permissions = [];
      });
  },
});

export const { clearAuth, setAuth } = authSlice.actions;

export const meSelector = (state: { [sliceName]: AuthState }) =>
  state[sliceName].me;
export const permissionsSelector = (state: { [sliceName]: AuthState }) =>
  state[sliceName].permissions;

export default authSlice.reducer;
