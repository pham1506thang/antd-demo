import { baseApi } from '../baseApi';
import type { 
  MediaResponseDto, 
  MediaListQueryDto, 
  UpdateMediaDto,
  FileUrlResponse,
  TagsResponse,
  MediaListResponse,
  MediaSizesResponse,
  MediaSizeResponseDto,
  MediaTagResponseDto,
  ProcessingStatus
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

    uploadProfileImage: builder.mutation<MediaResponseDto, {
      file: File;
      altText?: string;
      description?: string;
      isPublic?: boolean;
    }>({
      query: ({ file, altText, description, isPublic }) => {
        const formData = new FormData();
        formData.append('file', file);
        if (altText) formData.append('altText', altText);
        if (description) formData.append('description', description);
        if (isPublic !== undefined) formData.append('isPublic', isPublic.toString());
        return {
          url: '/medias/profile/upload',
          method: 'POST',
          data: formData,
        };
      },
      transformResponse: (response: MediaResponseDto) => response,
    }),

    uploadMultipleProfileImages: builder.mutation<MediaResponseDto[], {
      files: File[];
      altText?: string;
      description?: string;
      isPublic?: boolean;
    }>({
      query: ({ files, altText, description, isPublic }) => {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append('files', file);
        });
        if (altText) formData.append('altText', altText);
        if (description) formData.append('description', description);
        if (isPublic !== undefined) formData.append('isPublic', isPublic.toString());
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

    uploadGeneralImage: builder.mutation<MediaResponseDto, {
      file: File;
      altText?: string;
      description?: string;
      isPublic?: boolean;
    }>({
      query: ({ file, altText, description, isPublic }) => {
        const formData = new FormData();
        formData.append('file', file);
        if (altText) formData.append('altText', altText);
        if (description) formData.append('description', description);
        if (isPublic !== undefined) formData.append('isPublic', isPublic.toString());
        return {
          url: '/medias/general/upload',
          method: 'POST',
          data: formData,
        };
      },
    }),

    uploadMultipleGeneralImages: builder.mutation<MediaResponseDto[], {
      files: File[];
      altText?: string;
      description?: string;
      isPublic?: boolean;
    }>({
      query: ({ files, altText, description, isPublic }) => {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append('files', file);
        });
        if (altText) formData.append('altText', altText);
        if (description) formData.append('description', description);
        if (isPublic !== undefined) formData.append('isPublic', isPublic.toString());
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

// Helper functions for working with new media structure
export const mediaUtils = {
  /**
   * Get image URL from media sizes array
   * @param media - Media object with sizes array
   * @param sizeName - Size name to get URL for
   * @returns URL string or null if size not found
   */
  getImageUrl: (media: MediaResponseDto, sizeName: string): string | null => {
    const size: MediaSizeResponseDto | undefined = media.sizes.find(s => s.sizeName === sizeName);
    return size ? size.url : null;
  },

  /**
   * Get thumbnail URL from media sizes array
   * @param media - Media object with sizes array
   * @returns Thumbnail URL or null if not found
   */
  getThumbnailUrl: (media: MediaResponseDto): string | null => {
    return mediaUtils.getImageUrl(media, 'thumbnail');
  },

  /**
   * Get display URL from media sizes array (prefers large, falls back to original)
   * @param media - Media object with sizes array
   * @returns Display URL or null if not found
   */
  getDisplayUrl: (media: MediaResponseDto): string | null => {
    return mediaUtils.getImageUrl(media, 'large') || 
           mediaUtils.getImageUrl(media, 'original') || 
           media.sizes[0]?.url || null;
  },

  /**
   * Check if media is processing
   * @param media - Media object
   * @returns true if media is still processing
   */
  isProcessing: (media: MediaResponseDto): boolean => {
    const processingStatuses: ProcessingStatus[] = ['pending', 'processing'];
    return processingStatuses.includes(media.processingStatus as ProcessingStatus);
  },

  /**
   * Check if media processing failed
   * @param media - Media object
   * @returns true if media processing failed
   */
  isProcessingFailed: (media: MediaResponseDto): boolean => {
    return media.processingStatus === 'failed';
  },

  /**
   * Check if media is ready for display
   * @param media - Media object
   * @returns true if media is ready for display
   */
  isReady: (media: MediaResponseDto): boolean => {
    return media.processingStatus === 'completed' && media.sizes.length > 0;
  },

  /**
   * Get tags by name from media tags array
   * @param media - Media object with tags array
   * @param tagName - Tag name to search for
   * @returns Array of matching tags
   */
  getTagsByName: (media: MediaResponseDto, tagName: string): MediaTagResponseDto[] => {
    return media.tags.filter((tag: MediaTagResponseDto) => tag.tagName === tagName);
  },

  /**
   * Get tag value by name from media tags array
   * @param media - Media object with tags array
   * @param tagName - Tag name to search for
   * @returns First matching tag value or null
   */
  getTagValue: (media: MediaResponseDto, tagName: string): string | null => {
    const tag = media.tags.find((tag: MediaTagResponseDto) => tag.tagName === tagName);
    return tag ? tag.tagValue : null;
  }
};

// Legacy API functions removed - use RTK Query hooks directly