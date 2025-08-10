import { type Role, type User } from '@/models';
import { baseApi } from 'api/baseApi';
import { tokenService } from '@/services/tokenService';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  user: User<Role>;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: `/auths/login`,
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
    getMe: builder.query<User<Role>, void>({
      query: () => ({
        url: `/auths/me`,
        method: 'GET',
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: `/atuhs/logout`,
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
    })
  }),
}); 