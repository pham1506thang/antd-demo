import { baseApi } from '../baseApi';
import type { 
  Media, 
  MediaResponseDto, 
  MediaListQueryDto, 
  UpdateMediaDto,
  FileUrlResponse,
  TagsResponse,
  MediaListResponse,
  MediaSizesResponse
} from '@/models/media';
import { MEDIA_IMAGE_SIZES } from '@/constants/media';



// Media API slice
export const mediaApiSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Cross-category operations
    searchMedia: builder.query<MediaListResponse, {
      q: string;
      category?: 'general' | 'profile';
      type?: 'image' | 'audio' | 'video';
      page?: number;
      limit?: number;
    }>({
      query: (params) => ({
        url: '/medias/search',
        method: 'GET',
        params,
      }),
    }),

    filterMedia: builder.query<MediaListResponse, MediaListQueryDto>({
      query: (params) => ({
        url: '/medias/filter',
        method: 'GET',
        params,
      }),
    }),

    getAllTags: builder.query<TagsResponse, void>({
      query: () => ({
        url: '/medias/tags',
        method: 'GET',
      }),
    }),

    getMediaByTag: builder.query<MediaListResponse, {
      tagName: string;
      page?: number;
      limit?: number;
    }>({
      query: ({ tagName, ...params }) => ({
        url: `${'/medias/by-tag'}/${tagName}`,
        method: 'GET',
        params,
      }),
    }),

    getFileUrl: builder.query<FileUrlResponse, {
      mediaId: string;
      size?: string;
    }>({
      query: ({ mediaId, size = MEDIA_IMAGE_SIZES.ORIGINAL }) => ({
        url: `${'/medias'}/${mediaId}/file/${size}`,
        method: 'GET',
      }),
    }),

    // Profile operations
    uploadProfileImage: builder.mutation<MediaResponseDto, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: '/medias/profile/upload',
          method: 'POST',
          data: formData,
        };
      },
      transformResponse: (response: MediaResponseDto) => response,
    }),

    uploadMultipleProfileImages: builder.mutation<MediaResponseDto[], File[]>({
      query: (files) => {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append('files', file);
        });
        return {
          url: '/medias/profile/upload-multiple',
          method: 'POST',
          data: formData,
        };
      },
    }),

    listProfileImages: builder.query<MediaListResponse, {
      page?: number;
      limit?: number;
      search?: string;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
    }>({
      query: (params) => ({
        url: '/medias/profile',
        method: 'GET',
        params,
      }),
    }),

    getProfileImageDetails: builder.query<MediaResponseDto, string>({
      query: (id) => ({
        url: `${'/medias/profile'}/${id}`,
        method: 'GET',
      }),
    }),

    getProfileImageSizes: builder.query<MediaSizesResponse, string>({
      query: (id) => ({
        url: `${'/medias/profile'}/${id}/sizes`,
        method: 'GET',
      }),
    }),

    updateProfileImage: builder.mutation<MediaResponseDto, {
      id: string;
      data: UpdateMediaDto;
    }>({
      query: ({ id, data }) => ({
        url: `${'/medias/profile'}/${id}`,
        method: 'PUT',
        data,
      }),
    }),

    deleteProfileImage: builder.mutation<void, string>({
      query: (id) => ({
        url: `${'/medias/profile'}/${id}`,
        method: 'DELETE',
      }),
    }),

    searchProfileImages: builder.query<MediaListResponse, {
      q: string;
      page?: number;
      limit?: number;
    }>({
      query: (params) => ({
        url: '/medias/profile/search',
        method: 'GET',
        params,
      }),
    }),

    filterProfileImages: builder.query<MediaListResponse, {
      search?: string;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
      page?: number;
      limit?: number;
    }>({
      query: (params) => ({
        url: '/medias/profile/filter',
        method: 'GET',
        params,
      }),
    }),

    getProfileImagesByTag: builder.query<MediaListResponse, {
      tagName: string;
      page?: number;
      limit?: number;
    }>({
      query: ({ tagName, ...params }) => ({
        url: `${'/medias/profile/by-tag'}/${tagName}`,
        method: 'GET',
        params,
      }),
    }),

    getProfileImageFileUrl: builder.query<FileUrlResponse, {
      id: string;
      size?: string;
    }>({
      query: ({ id, size = MEDIA_IMAGE_SIZES.ORIGINAL }) => ({
        url: `${'/medias/profile'}/${id}/file/${size}`,
        method: 'GET',
      }),
    }),

    // General operations
    uploadGeneralImage: builder.mutation<MediaResponseDto, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: '/medias/general/upload',
          method: 'POST',
          data: formData,
        };
      },
    }),

    uploadMultipleGeneralImages: builder.mutation<MediaResponseDto[], File[]>({
      query: (files) => {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append('files', file);
        });
        return {
          url: '/medias/general/upload-multiple',
          method: 'POST',
          data: formData,
        };
      },
    }),

    listGeneralImages: builder.query<MediaListResponse, {
      page?: number;
      limit?: number;
      search?: string;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
    }>({
      query: (params) => ({
        url: '/medias/general',
        method: 'GET',
        params,
      }),
    }),

    getGeneralImageDetails: builder.query<MediaResponseDto, string>({
      query: (id) => ({
        url: `${'/medias/general'}/${id}`,
        method: 'GET',
      }),
    }),

    getGeneralImageSizes: builder.query<MediaSizesResponse, string>({
      query: (id) => ({
        url: `${'/medias/general'}/${id}/sizes`,
        method: 'GET',
      }),
    }),

    updateGeneralImage: builder.mutation<MediaResponseDto, {
      id: string;
      data: UpdateMediaDto;
    }>({
      query: ({ id, data }) => ({
        url: `${'/medias/general'}/${id}`,
        method: 'PUT',
        data,
      }),
    }),

    deleteGeneralImage: builder.mutation<void, string>({
      query: (id) => ({
        url: `${'/medias/general'}/${id}`,
        method: 'DELETE',
      }),
    }),

    searchGeneralImages: builder.query<MediaListResponse, {
      q: string;
      page?: number;
      limit?: number;
    }>({
      query: (params) => ({
        url: '/medias/general/search',
        method: 'GET',
        params,
      }),
    }),

    filterGeneralImages: builder.query<MediaListResponse, {
      search?: string;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
      page?: number;
      limit?: number;
    }>({
      query: (params) => ({
        url: '/medias/general/filter',
        method: 'GET',
        params,
      }),
    }),

    getGeneralImagesByTag: builder.query<MediaListResponse, {
      tagName: string;
      page?: number;
      limit?: number;
    }>({
      query: ({ tagName, ...params }) => ({
        url: `${'/medias/general/by-tag'}/${tagName}`,
        method: 'GET',
        params,
      }),
    }),

    getGeneralImageFileUrl: builder.query<FileUrlResponse, {
      id: string;
      size?: string;
    }>({
      query: ({ id, size = MEDIA_IMAGE_SIZES.ORIGINAL }) => ({
        url: `${'/medias/general'}/${id}/file/${size}`,
        method: 'GET',
      }),
    }),
  }),
});

// Export hooks for use in components
export const {
  // Cross-category operations
  useSearchMediaQuery,
  useFilterMediaQuery,
  useGetAllTagsQuery,
  useGetMediaByTagQuery,
  useGetFileUrlQuery,
  
  // Profile operations
  useUploadProfileImageMutation,
  useUploadMultipleProfileImagesMutation,
  useListProfileImagesQuery,
  useGetProfileImageDetailsQuery,
  useGetProfileImageSizesQuery,
  useUpdateProfileImageMutation,
  useDeleteProfileImageMutation,
  useSearchProfileImagesQuery,
  useFilterProfileImagesQuery,
  useGetProfileImagesByTagQuery,
  useGetProfileImageFileUrlQuery,
  
  // General operations
  useUploadGeneralImageMutation,
  useUploadMultipleGeneralImagesMutation,
  useListGeneralImagesQuery,
  useGetGeneralImageDetailsQuery,
  useGetGeneralImageSizesQuery,
  useUpdateGeneralImageMutation,
  useDeleteGeneralImageMutation,
  useSearchGeneralImagesQuery,
  useFilterGeneralImagesQuery,
  useGetGeneralImagesByTagQuery,
  useGetGeneralImageFileUrlQuery,
} = mediaApiSlice;

// Legacy API functions for backward compatibility
export const mediaApi = {
  getImages: async (): Promise<{ data: Media[]; total: number; page: number; limit: number }> => {
    // This is now handled by the RTK Query hooks
    // Keeping for backward compatibility
    throw new Error('Use RTK Query hooks instead of legacy mediaApi functions');
  },
  
  uploadImage: async (): Promise<Media> => {
    // This is now handled by the RTK Query hooks
    // Keeping for backward compatibility
    throw new Error('Use RTK Query hooks instead of legacy mediaApi functions');
  },
  
  getImageSizes: async () => {
    // This is now handled by the RTK Query hooks
    // Keeping for backward compatibility
    throw new Error('Use RTK Query hooks instead of legacy mediaApi functions');
  },
};