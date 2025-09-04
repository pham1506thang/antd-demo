import { createApi } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { AxiosRequestConfig, AxiosError } from 'axios';
import axiosInstance from './axiosConfig';
import { DOMAINS, SUMMARY_DOMAINS } from '@/models/permission';
import type { ApiError } from '@/models/error';

// Define custom axios base query
const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig['method'];
      data?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
    },
    unknown,
    ApiError
  > =>
  async ({ url, method, data, params }) => {
    try {
      const result = await axiosInstance({
        url,
        method,
        data,
        params,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;

      if (err.response) {
        const responseData = err.response.data as ApiError;

        const apiError: ApiError = {
          statusCode: responseData.statusCode,
          error: responseData.error,
          message: responseData.message,
          details: responseData.details,
        };

        return {
          error: apiError,
        };
      } else if (err.request) {
        const networkError: ApiError = {
          statusCode: 0,
          error: 'NETWORK_ERROR',
          message:
            'No response from server. Please check your internet connection.',
          details: {},
        };

        return {
          error: networkError,
        };
      } else {
        const unknownError: ApiError = {
          statusCode: 500,
          error: 'UNKNOWN_ERROR',
          message: err.message || 'An unknown error occurred',
          details: {},
        };

        return {
          error: unknownError,
        };
      }
    }
  };

// Create the base API
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  endpoints: () => ({}),
  tagTypes: [
    ...Object.values(DOMAINS).map((domainValue) => domainValue.value),
    ...Object.values(SUMMARY_DOMAINS).map((domainValue) => domainValue.value),
    'Permissions',
  ],
});
