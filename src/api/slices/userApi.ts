import {
  type AssignRoleDTO,
  type CreateUserDTO,
  type UpdateUserDTO,
  type User,
  DOMAINS,
} from '@/models';
import { baseApi } from 'api/baseApi';
import type { PaginationParams, PaginationResult } from '@/models/pagination';
import { buildQueryString } from '@/api/apiHelper';

type GetUsersResponse = PaginationResult<User>;

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<GetUsersResponse, PaginationParams<User>>({
      query: (params) => {
        const queryString = buildQueryString(params);
        return {
          url: `/${DOMAINS.USERS.value}/${queryString}`,
          method: 'GET',
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: DOMAINS.USERS.value,
                id,
              })),
              { type: DOMAINS.USERS.value, id: 'LIST' },
            ]
          : [{ type: DOMAINS.USERS.value, id: 'LIST' }],
    }),
    getUser: builder.query<User, string>({
      query: (id) => ({
        url: `/${DOMAINS.USERS.value}/${id}`,
        method: 'GET',
      }),
      providesTags: (_, __, id) => [{ type: DOMAINS.USERS.value, id }],
    }),
    createUser: builder.mutation<User, CreateUserDTO>({
      query: (user) => ({
        url: `/${DOMAINS.USERS.value}`,
        method: 'POST',
        data: user,
      }),
      invalidatesTags: [{ type: DOMAINS.USERS.value, id: 'LIST' }],
    }),
    updateUser: builder.mutation<User, { id: string } & UpdateUserDTO>({
      query: ({ id, ...user }) => ({
        url: `/${DOMAINS.USERS.value}/${id}`,
        method: 'PUT',
        data: user,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: DOMAINS.USERS.value, id },
        { type: DOMAINS.USERS.value, id: 'LIST' },
      ],
    }),
    changePassword: builder.mutation<
      void,
      { id: string } & ChangePasswordRequest
    >({
      query: ({ id, ...passwords }) => ({
        url: `/${DOMAINS.USERS.value}/${id}/change-password`,
        method: 'PATCH',
        data: passwords,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: DOMAINS.USERS.value, id },
        { type: DOMAINS.USERS.value, id: 'LIST' },
      ],
    }),
    updateAvatar: builder.mutation<User, string>({
      query: (avatarUrl) => ({
        url: '/users/avatar',
        method: 'PUT',
        data: { avatarUrl },
      }),
      invalidatesTags: [{ type: DOMAINS.USERS.value, id: 'LIST' }],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: DOMAINS.USERS.value, id: 'LIST' }],
    }),
    assignUserRole: builder.mutation<User, { id: string } & AssignRoleDTO>({
      query: ({ id, roles }) => ({
        url: `/users/${id}/assign-roles`,
        method: 'PATCH',
        data: { roles },
      }),
      invalidatesTags: [{ type: DOMAINS.USERS.value, id: 'LIST' }],
    }),
  }),
});
