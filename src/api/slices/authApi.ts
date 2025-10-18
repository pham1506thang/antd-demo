import { baseApi } from 'api/baseApi';
import type { AuthLoginDTO, AuthUpdateProfileDTO, AuthChangePasswordDTO, AuthResponse, LoginResponse } from '@/models';
import { DOMAINS } from '@/models/permission';
import axiosInstance from '@/api/axiosConfig';
import { updateUser } from '@/store/slices/authSlice';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, AuthLoginDTO>({
      query: (credentials) => ({
        url: '/auths/login',
        method: 'POST',
        data: credentials,
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          // Set the access token to axios instance for subsequent requests
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
        } catch {
          // Handle error if needed
        }
      },
    }),
    getAuth: builder.query<AuthResponse, void>({
      query: () => ({
        url: '/auths/auth',
        method: 'GET',
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auths/logout',
        method: 'POST',
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch {
          // Handle error if needed
        } finally {
          // Token will be cleared by the component that calls this mutation
          // This is just for the API definition
        }
      },
    }),
    updateProfile: builder.mutation<{ message: string }, AuthUpdateProfileDTO>({
      query: (profileData) => ({
        url: '/auths/profile',
        method: 'PATCH',
        data: profileData,
      }),
      invalidatesTags: [{ type: DOMAINS.USERS.value, id: 'LIST' }],
      onQueryStarted: async (profileData, { dispatch, queryFulfilled }) => {
        try {

          await queryFulfilled;
          // Update user info in store after successful update
          dispatch(updateUser(profileData));
        } catch {
          // Handle error if needed
        }
      },
    }),
    changePassword: builder.mutation<{ message: string }, AuthChangePasswordDTO>({
      query: (passwordData) => ({
        url: '/auths/change-password',
        method: 'PATCH',
        data: passwordData,
      }),
    }),
  }),
});

export const {
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = authApi;