import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from 'models/user';
import type { Role } from 'models/role';
import { authApi } from 'api/slices/authApi';
import { userApi } from '@/api/slices/userApi';

interface MeState {
  me: User<Role> | null;
}

const initialState: MeState = {
  me: null,
};

export const meSlice = createSlice({
  name: 'me',
  initialState,
  reducers: {
    clearMe: (state) => {
      state.me = null;
    },
    setMe: (state, action: PayloadAction<User<Role>>) => {
      state.me = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        userApi.endpoints.updateUser.matchFulfilled,
        (state, { payload }) => {
          if (state.me && payload) {
            state.me = {
              ...state.me,
              ...payload,
              roles: state.me.roles,
            };
          }
        }
      )
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.me = null;
      });
  },
});

export const { clearMe, setMe } = meSlice.actions;

export const selectMe = (state: { me: MeState }) => state.me.me;

export default meSlice.reducer; 