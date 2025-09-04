import { baseApi } from '../baseApi';
import type { Permission } from '@/models/permission';

export const permissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPermissions: builder.query<Permission[], void>({
      query: () => ({
        url: '/permissions',
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: 'Permissions' as const,
                id,
              })),
              { type: 'Permissions' as const, id: 'LIST' },
            ]
          : [{ type: 'Permissions' as const, id: 'LIST' }],
    }),
  }),
});

export const { useGetPermissionsQuery } = permissionApi;
