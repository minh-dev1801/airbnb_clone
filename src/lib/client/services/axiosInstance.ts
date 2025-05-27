import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

const isClient = typeof window !== 'undefined';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    TokenCybersoft: process.env.NEXT_PUBLIC_TOKEN_CYBERSOFT,
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (isClient) {
      const token = JSON.parse(localStorage.getItem('authToken') || '');
      if (token) {
        config.headers.token = token;
      } else {
        delete config.headers.token;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response && isClient) {
      const { status } = error.response;
      if (status === 401) {
        localStorage.removeItem('authToken');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
