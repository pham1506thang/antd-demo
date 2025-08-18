import axios from 'axios';
import type {
  AxiosError,
  AxiosInstance,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios';
import { message } from 'antd';
import { tokenService } from '@/services/tokenService';

// Extend AxiosRequestConfig to include _retry flag
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
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
    const token = tokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

const rawAxios = axios.create(AXIOS_CONFIG);

// Create a flag to track refresh state
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Helper to simulate delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to add callbacks to the subscriber queue
const addRefreshSubscriber = (callback: (token: string) => void) => {
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
            addRefreshSubscriber((token: string) => {
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

        tokenService.setToken(accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Process any queued requests
        processQueue(null, accessToken);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear token and process queue with error
        tokenService.removeToken();
        processQueue(new Error('Refresh failed'));

        // Just show error message, let components handle navigation
        message.error('Session expired. Please login again.');

        await delay(1000);
        window.location.href = '/login';

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
