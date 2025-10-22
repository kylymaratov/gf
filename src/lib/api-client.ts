import axios, { AxiosError } from "axios";
import { ENV } from "./env";

const API_URL = ENV.API_URL;

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
  withCredentials: true, // Разрешаем отправку и получение cookies
});

// Response interceptor для обработки ошибок (без удаления cookies)
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Просто пробрасываем ошибку дальше, не удаляем cookies
    return Promise.reject(error);
  }
);

export default apiClient;

