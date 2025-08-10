import { type User, type Role, DOMAINS } from '@/models';
import { baseApi } from 'api/baseApi';
import type { PaginationParams, PaginationResult } from '@/models/pagination';
import { buildQueryString } from '@/api/apiHelper';

interface GetUsersResponse extends PaginationResult<User<Role>> {}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<GetUsersResponse, PaginationParams<User<Role>>>({
      query: (params) => {
        const queryString = buildQueryString(params);
        return {
          url: `/${DOMAINS.USERS.value}/${queryString}`,
          method: 'GET',
        };
      },
      providesTags: [DOMAINS.USERS.value],
    }),
    getUser: builder.query<User<Role>, string>({
      query: (id) => ({
        url: `/${DOMAINS.USERS.value}/${id}`,
        method: 'GET',
      }),
      providesTags: (_, __, id) => [{ type: DOMAINS.USERS.value, id }],
    }),
    createUser: builder.mutation<User<Role>, Partial<User<string>>>({
      query: (user) => ({
        url: '/users',
        method: 'POST',
        data: user,
      }),
      invalidatesTags: [DOMAINS.USERS.value],
    }),
    updateUser: builder.mutation<User<Role>, { id: string; user: Partial<User<string>> }>({
      query: ({ id, user }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        data: user,
      }),
      invalidatesTags: [DOMAINS.USERS.value],
    }),
    changePassword: builder.mutation<void, ChangePasswordRequest>({
      query: (passwords) => ({
        url: `/${DOMAINS.USERS.value}/change-password`,
        method: 'PATCH',
        data: passwords,
      }),
    }),
    updateAvatar: builder.mutation<User<Role>, string>({
      query: (avatarUrl) => ({
        url: '/users/avatar',
        method: 'PUT',
        data: { avatarUrl },
      }),
      invalidatesTags: [DOMAINS.USERS.value],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [DOMAINS.USERS.value],
    }),
  }),
});