import axios from 'axios';
import type {
  AxiosError,
  AxiosInstance,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios';
import { message } from 'antd';
import { clearAuthState } from '@/utils/authUtils';

// Extend AxiosRequestConfig to include _retry flag
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const AXIOS_CONFIG: CreateAxiosDefaults = {
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
};
// Create axios instance
const axiosInstance: AxiosInstance = axios.create(AXIOS_CONFIG);

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // No need to add Authorization header manually
    // The server will use refreshToken from httpOnly cookie
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

const rawAxios = axios.create(AXIOS_CONFIG);

// Create a flag to track refresh state
let isRefreshing = false;
let refreshSubscribers: ((_token: string) => void)[] = [];

// Helper to simulate delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to add callbacks to the subscriber queue
const addRefreshSubscriber = (callback: (_token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Helper to process the subscriber queue
const processQueue = (error: Error | null, token: string | null = null) => {
  refreshSubscribers.forEach((callback) => {
    if (error) {
      // If refresh failed, reject all queued requests
      callback('');
    } else if (token) {
      // If refresh succeeded, retry all queued requests
      callback(token);
    }
  });
  refreshSubscribers = [];
};

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }
    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If we're already refreshing, queue this request
        try {
          const newToken = await new Promise<string>((resolve, reject) => {
            addRefreshSubscriber((token) => {
              if (token) {
                resolve(token);
              } else {
                reject(new Error('Refresh failed'));
              }
            });
          });
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      // Start the refresh process
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Simulate delay in refresh token
        await delay(500);

        // Attempt to refresh token
        const response = await rawAxios.post('/auths/refresh');
        const { accessToken } = response.data;

        // Set the new token to axios instance default headers
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        
        // Also set for the original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Process any queued requests
        processQueue(null, accessToken);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, process queue with error
        processQueue(new Error('Refresh failed'));

        // Clear all auth state
        clearAuthState();

        // Show error message
        message.error('Session expired. Please login again.');
        
        // Only redirect if not already on login page
        if (window.location.pathname !== '/login') {
          await delay(1000);
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors
    if (error.response) {
      const messageFromApi: string | string[] | undefined = (
        error.response.data as any
      ).message;
      if (!messageFromApi) {
        message.error('An error occurred. Please try again.');
      } else if (Array.isArray(messageFromApi)) {
        messageFromApi.forEach((m) => message.error(m));
      } else {
        message.error(messageFromApi);
      }
    } else if (error.request) {
      message.error(
        'No response from server. Please check your internet connection.'
      );
    } else {
      message.error('Request failed. Please try again.');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
