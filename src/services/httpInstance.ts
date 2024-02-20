import axios from "axios";
import Config from "../config";

interface AxiosError {
  response?: {
    status: number;
    data?: {
      detail: string;
      code?: string;
    };
  };
}

const httpInstance = axios.create({
  baseURL: Config.API_URL,
});

// Response interceptor
httpInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const tokens = localStorage.getItem('tokens');
        const refreshToken: string = JSON.parse(tokens!).refresh_token;
        const response = await axios.post(`${Config.API_URL}token/refresh/`, { "refresh": refreshToken }, { headers: { 'Content-Type': 'application/json' } });
        const access = response.data.access;

        localStorage.setItem('tokens', JSON.stringify({ access_token: access, refresh_token: refreshToken }));

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return axios(originalRequest);
      } catch (error) {
        const axiosRefreshError = error as AxiosError;
        if (axiosRefreshError.response?.status === 401 && axiosRefreshError.response?.data?.code === 'token_not_valid') {
          // If the refresh token has expired, we need to log in again
          window.location.href = '/login';
          // Delete the tokens from the local storage
          localStorage.removeItem('user');
          localStorage.removeItem('tokens');
          localStorage.removeItem('isAdmin');
        }
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default httpInstance;
