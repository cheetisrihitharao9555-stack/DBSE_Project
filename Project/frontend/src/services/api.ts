import axios, { AxiosError } from "axios";

export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8081/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("crm_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("crm_token");
      localStorage.removeItem("crm_user");
    }

    return Promise.reject(error);
  }
);

export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const e = err as AxiosError<{ message?: string }>;

    if (e.response?.data?.message) {
      return e.response.data.message;
    }

    if (!e.response) {
      return "Cannot reach the server. Is the Spring Boot backend running?";
    }

    return `Request failed (HTTP ${e.response.status}).`;
  }

  return err instanceof Error ? err.message : "Something went wrong.";
}