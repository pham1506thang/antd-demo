import { type User, type Role, Domains } from '@/models';
import { baseApi } from 'api/baseApi';
import type { PaginationParams, PaginationResult } from '@/models/pagination';

interface GetUsersResponse extends PaginationResult<User<Role>> {}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<GetUsersResponse, PaginationParams>({
      query: (params) => ({
        url: '/users',
        method: 'GET',
        params,
      }),
      providesTags: [Domains.Users],
    }),
    getUser: builder.query<User<Role>, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: Domains.Users, id }],
    }),
    createUser: builder.mutation<User<Role>, Partial<User<string>>>({
      query: (user) => ({
        url: '/users',
        method: 'POST',
        data: user,
      }),
      invalidatesTags: [Domains.Users],
    }),
    updateUser: builder.mutation<User<Role>, { id: string; user: Partial<User<string>> }>({
      query: ({ id, user }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        data: user,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: Domains.Users, id }],
    }),
    changePassword: builder.mutation<void, ChangePasswordRequest>({
      query: (passwords) => ({
        url: `/${Domains.Users}/change-password`,
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
      invalidatesTags: [Domains.Users, Domains.Auths],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [Domains.Users],
    }),
  }),
}); 