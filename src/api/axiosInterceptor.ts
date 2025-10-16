import axios, { type AxiosError } from 'axios';
import { AuthService, OpenAPI } from './generated';
import { authManager } from '../services/authManager';

// A function to get the navigate function from our router context
// This is a bit of a hack, as we can't use the useNavigate hook outside of a component.
// We will set this up in main.tsx
let navigate: (path: string) => void;
export const setNavigate = (nav: (path: string) => void) => {
  navigate = nav;
};

// Variables to handle concurrent requests
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: unknown) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const setupAxiosInterceptor = () => {
  // Use the default axios instance used by the generated client
  const axiosInstance = axios;

  axiosInstance.interceptors.response.use(
    (response) => response, // Directly return successful responses
    async (error: AxiosError) => {
      const originalRequest = error.config;

      // Check for 401 error and that it's not a retry request
      if (error.response?.status === 401 && originalRequest) {
        if (isRefreshing) {
          return new Promise(function(resolve, reject) {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return axiosInstance(originalRequest);
          }).catch(err => {
            return Promise.reject(err);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const { refreshToken } = authManager.getTokens();
        if (!refreshToken) {
          isRefreshing = false;
          authManager.logout(navigate);
          return Promise.reject(error);
        }

        try {
          const response = await AuthService.postApiAuthRefresh({ refreshToken });
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response;
          
          authManager.setTokens(newAccessToken, newRefreshToken);
          OpenAPI.TOKEN = newAccessToken;

          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          
          processQueue(null, newAccessToken);
          return axiosInstance(originalRequest);
        } catch (refreshError: any) {
          processQueue(refreshError, null);
          authManager.logout(navigate);
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // For all other errors, just reject
      return Promise.reject(error);
    }
  );
};

declare module 'axios' {
    export interface AxiosRequestConfig {
      _retry?: boolean;
    }
  }

export default setupAxiosInterceptor;
