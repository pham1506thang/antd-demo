import { baseApi } from 'api/baseApi';
import { tokenService } from '@/services/tokenService';
import type { Permission, User } from '@/models';

interface LoginRequest {
  username: string;
  password: string;
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
          tokenService.setToken(data.accessToken);
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
          tokenService.removeToken();
        } catch {
          // Handle error if needed
        }
      },
    }),
  }),
});
