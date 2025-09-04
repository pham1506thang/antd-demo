import {
  type CreateRoleDTO,
  type UpdateRoleDTO,
  type Role,
  type SummaryRole,
  DOMAINS,
  SUMMARY_DOMAINS,
} from '@/models';
import { baseApi } from 'api/baseApi';
import type { PaginationParams, PaginationResult } from '@/models/pagination';
import { buildQueryString } from '@/api/apiHelper';

export const roleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<PaginationResult<Role>, PaginationParams<Role>>({
      query: (params) => {
        const queryString = buildQueryString(params);
        return {
          url: `/${DOMAINS.ROLES.value}/${queryString}`,
          method: 'GET',
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: DOMAINS.ROLES.value,
                id,
              })),
              { type: DOMAINS.ROLES.value, id: 'LIST' },
            ]
          : [{ type: DOMAINS.ROLES.value, id: 'LIST' }],
    }),
    getRole: builder.query<Role, string>({
      query: (id) => ({
        url: `/${DOMAINS.ROLES.value}/${id}`,
        method: 'GET',
      }),
      providesTags: (_, __, id) => [{ type: DOMAINS.ROLES.value, id }],
    }),
    getSummaryRoles: builder.query<SummaryRole[], void>({
      query: () => ({
        url: `/${DOMAINS.ROLES.value}/summary`,
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: SUMMARY_DOMAINS.ROLES.value,
                id,
              })),
              { type: SUMMARY_DOMAINS.ROLES.value, id: 'LIST' },
            ]
          : [{ type: SUMMARY_DOMAINS.ROLES.value, id: 'LIST' }],
    }),
    createRole: builder.mutation<Role, CreateRoleDTO>({
      query: (role) => ({
        url: `/${DOMAINS.ROLES.value}`,
        method: 'POST',
        data: role,
      }),
      invalidatesTags: [{ type: DOMAINS.ROLES.value, id: 'LIST' }],
    }),
    updateRole: builder.mutation<Role, { id: string } & UpdateRoleDTO>({
      query: ({ id, ...role }) => ({
        url: `/${DOMAINS.ROLES.value}/${id}`,
        method: 'PUT',
        data: role,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: DOMAINS.ROLES.value, id },
        { type: DOMAINS.ROLES.value, id: 'LIST' },
      ],
    }),
    deleteRole: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${DOMAINS.ROLES.value}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: DOMAINS.ROLES.value, id: 'LIST' }],
    }),
    assignPermissions: builder.mutation<
      Role,
      { id: string; permissions: string[] }
    >({
      query: ({ id, permissions }) => ({
        url: `/${DOMAINS.ROLES.value}/${id}/assign-permissions`,
        method: 'PATCH',
        data: { permissions },
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: DOMAINS.ROLES.value, id },
        { type: DOMAINS.ROLES.value, id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetRoleQuery,
  useGetSummaryRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useAssignPermissionsMutation,
} = roleApi;