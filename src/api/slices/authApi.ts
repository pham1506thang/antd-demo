import { baseApi } from 'api/baseApi';
import type { Permission, User } from '@/models';
import axiosInstance from '@/api/axiosConfig';

interface LoginRequest {
  username: string;
  password: string;
}

interface UpdateProfileRequest {
  name?: string;
  email?: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface GetAuthResponse {
  me: User;
  permissions: Permission[];
}

interface LoginResponse {
  accessToken: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
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
    getAuth: builder.query<GetAuthResponse, void>({
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
    updateProfile: builder.mutation<{ message: string }, UpdateProfileRequest>({
      query: (profileData) => ({
        url: '/auths/profile',
        method: 'PATCH',
        data: profileData,
      }),
    }),
    changePassword: builder.mutation<{ message: string }, ChangePasswordRequest>({
      query: (passwordData) => ({
        url: '/auths/change-password',
        method: 'PATCH',
        data: passwordData,
      }),
    }),
  }),
});
