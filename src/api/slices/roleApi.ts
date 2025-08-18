import { DOMAINS } from '@/models';
import { type SummaryRole } from '@/models/role';
import { baseApi } from 'api/baseApi';

interface GetSummaryRolesResponse extends Array<SummaryRole> {}

export const roleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSummaryRoles: builder.query<GetSummaryRolesResponse, void>({
      query: () => ({
        url: `/${DOMAINS.ROLES.value}/summary`,
        method: 'GET',
      }),
      providesTags: [DOMAINS.ROLES.actions.VIEW_SUMMARY],
    }),
  }),
});

export const { useGetSummaryRolesQuery } = roleApi;
