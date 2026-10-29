import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { AuthResponse } from "@/types/auth";
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  saveSession,
} from "@/lib/auth/token-storage";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

const api = axios.create({
  baseURL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshClient = axios.create({
  baseURL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

const NO_REFRESH_PATHS = ["/auth/login", "/auth/register", "/auth/refresh"];

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface ApiError {
  status: number | null;
  message: string;
  data?: unknown;
}

type ErrorBody = { message?: string | string[] };

function toApiError(error: AxiosError<ErrorBody>): ApiError {
  if (error.code === AxiosError.ECONNABORTED || error.code === AxiosError.ETIMEDOUT) {
    return {
      status: null,
      message: "The server is taking too long to respond. Please try again.",
    };
  }

  const raw = error.response?.data?.message;
  const message = Array.isArray(raw) ? raw.join(", ") : raw;
  return {
    status: error.response?.status ?? null,
    message: message ?? error.message ?? "Something went wrong",
    data: error.response?.data,
  };
}

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");

  const { data } = await refreshClient.post<AuthResponse>("/auth/refresh", {
    refreshToken,
  });
  saveSession(data);
  return data.accessToken;
}

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorBody>) => {
    const original = error.config as RetriableConfig | undefined;
    const isAuthPath = NO_REFRESH_PATHS.some((p) => original?.url?.includes(p));

    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !isAuthPath &&
      typeof window !== "undefined"
    ) {
      original._retry = true;
      try {
        refreshPromise ??= refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
        const token = await refreshPromise;
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      } catch {
        clearSession();
      }
    }

    return Promise.reject(toApiError(error));
  }
);

export default api;
