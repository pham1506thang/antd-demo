import { Domains, type Role, type User } from '@/models';
import { baseApi } from '../baseApi';
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
        url: `/${Domains.Auths}/login`,
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
      invalidatesTags: [Domains.Auths],
    }),
    getMe: builder.query<User<Role>, void>({
      query: () => ({
        url: `/${Domains.Auths}/me`,
        method: 'GET',
      }),
      providesTags: [Domains.Auths],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: `/${Domains.Auths}/logout`,
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
      invalidatesTags: [Domains.Auths],
    })
  }),
}); 