import { baseApi } from '../baseApi';
import type { MediaImage } from '@/models/media';
import type { UpdateMediaDto, UploadMediaDto } from '@/models/dto';
import type {
  InfiniteParamsDto,
  InfinitePaginationResult,
} from '@/models/infinite-pagination';
import { buildQueryString, convertResponseTimeToDate } from '@/api/apiHelper';
import { DOMAINS } from '@/models/permission';
import { MEDIA_CATEGORIES } from '@/constants/media';

// Media API slice
export const mediaApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadProfileImage: builder.mutation<MediaImage, UploadMediaDto>({
      query: ({ file, altText, description, isPublic }) => {
        const formData = new FormData();
        formData.append('file', file);
        if (altText) formData.append('altText', altText);
        if (description) formData.append('description', description);
        if (isPublic !== undefined)
          formData.append('isPublic', isPublic.toString());
        return {
          url: `/${DOMAINS.MEDIAS.value}/${MEDIA_CATEGORIES.PROFILE}/upload`,
          method: 'POST',
          data: formData,
        };
      },
      transformResponse: (response: MediaImage) => response,
    }),

    uploadMultipleProfileImages: builder.mutation<MediaImage[], UploadMediaDto>({
      query: ({ altText, description, isPublic }) => {
        const formData = new FormData();
        // files.forEach((file) => {
        //   formData.append('files', file);
        // });
        if (altText) formData.append('altText', altText);
        if (description) formData.append('description', description);
        if (isPublic !== undefined)
          formData.append('isPublic', isPublic.toString());
        return {
          url: `/${DOMAINS.MEDIAS.value}/${MEDIA_CATEGORIES.PROFILE}/upload-multiple`,
          method: 'POST',
          data: formData,
        };
      },
    }),

    listProfileImages: builder.query<
      InfinitePaginationResult<MediaImage>,
      InfiniteParamsDto<MediaImage>
    >({
      query: (params) => {
        const queryString = buildQueryString(params);
        return {
          url: `/${DOMAINS.MEDIAS.value}/${MEDIA_CATEGORIES.PROFILE}${queryString}`,
          method: 'GET',
        };
      },
      
      // Group queries by non-cursor params to enable data merging
      serializeQueryArgs: ({ queryArgs }) => {
        const { cursor, ...otherArgs } = queryArgs;
        return otherArgs; // Group by search, sort, limit, filters
      },
      
      // Merge strategy for infinite scroll
      merge: (currentCache, newItems, { arg }) => {
        if (arg.cursor) {
          // Has cursor = load more → append new data
          currentCache.data.push(...newItems.data);
        } else {
          // No cursor = new search/sort → replace data
          currentCache.data = newItems.data;
        }
        // Update pagination info
        currentCache.pagination = newItems.pagination;
      },
      
      // Force refetch when params change
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      
      transformResponse: (response: InfinitePaginationResult<any>) => {
        return {
          ...response,
          data: response.data.map(convertResponseTimeToDate),
        } as InfinitePaginationResult<MediaImage>;
      },
    }),

    updateProfileImage: builder.mutation<
      MediaImage,
      { id: string; data: UpdateMediaDto }
    >({
      query: ({ id, data }) => ({
        url: `/${DOMAINS.MEDIAS.value}/${MEDIA_CATEGORIES.PROFILE}/${id}`,
        method: 'PUT',
        data,
      }),
    }),

    deleteProfileImage: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${DOMAINS.MEDIAS.value}/${MEDIA_CATEGORIES.PROFILE}/${id}`,
        method: 'DELETE',
      }),
    }),

    uploadGeneralImage: builder.mutation<MediaImage, UploadMediaDto>({
      query: ({ file, altText, description, isPublic }) => {
        const formData = new FormData();
        formData.append('file', file);
        if (altText) formData.append('altText', altText);
        if (description) formData.append('description', description);
        if (isPublic !== undefined)
          formData.append('isPublic', isPublic.toString());
        return {
          url: `/${DOMAINS.MEDIAS.value}/${MEDIA_CATEGORIES.GENERAL}/upload`,
          method: 'POST',
          data: formData,
        };
      },
    }),

    uploadMultipleGeneralImages: builder.mutation<MediaImage[], UploadMediaDto>({
      query: ({ altText, description, isPublic }) => {
        const formData = new FormData();
        // files.forEach((file) => {
        //   formData.append('files', file);
        // });
        if (altText) formData.append('altText', altText);
        if (description) formData.append('description', description);
        if (isPublic !== undefined)
          formData.append('isPublic', isPublic.toString());
        return {
          url: `/${DOMAINS.MEDIAS.value}/${MEDIA_CATEGORIES.GENERAL}/upload-multiple`,
          method: 'POST',
          data: formData,
        };
      },
    }),

    listGeneralImages: builder.query<
      InfinitePaginationResult<MediaImage>,
      InfiniteParamsDto<MediaImage>
    >({
      query: (params) => {
        const queryString = buildQueryString(params);
        return {
          url: `/${DOMAINS.MEDIAS.value}/${MEDIA_CATEGORIES.GENERAL}${queryString}`,
          method: 'GET',
        };
      },
      
      // Group queries by non-cursor params to enable data merging
      serializeQueryArgs: ({ queryArgs }) => {
        const { cursor, ...otherArgs } = queryArgs;
        return otherArgs; // Group by search, sort, limit, filters
      },
      
      // Merge strategy for infinite scroll
      merge: (currentCache, newItems, { arg }) => {
        if (arg.cursor) {
          // Has cursor = load more → append new data
          currentCache.data.push(...newItems.data);
        } else {
          // No cursor = new search/sort → replace data
          currentCache.data = newItems.data;
        }
        // Update pagination info
        currentCache.pagination = newItems.pagination;
      },
      
      // Force refetch when params change
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      
      transformResponse: (response: InfinitePaginationResult<any>) => {
        return {
          ...response,
          data: response.data.map(convertResponseTimeToDate),
        } as InfinitePaginationResult<MediaImage>;
      },
    }),

    updateGeneralImage: builder.mutation<
      MediaImage,
      { id: string; data: UpdateMediaDto }
    >({
      query: ({ id, data }) => ({
        url: `/${DOMAINS.MEDIAS.value}/${MEDIA_CATEGORIES.GENERAL}/${id}`,
        method: 'PUT',
        data,
      }),
    }),

    deleteGeneralImage: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${DOMAINS.MEDIAS.value}/${MEDIA_CATEGORIES.GENERAL}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

// Export hooks for use in components
export const {
  // Profile operations
  useUploadProfileImageMutation,
  useUploadMultipleProfileImagesMutation,
  useListProfileImagesQuery,
  useUpdateProfileImageMutation,
  useDeleteProfileImageMutation,

  // General operations
  useUploadGeneralImageMutation,
  useUploadMultipleGeneralImagesMutation,
  useListGeneralImagesQuery,
  useUpdateGeneralImageMutation,
  useDeleteGeneralImageMutation,
} = mediaApiSlice;
