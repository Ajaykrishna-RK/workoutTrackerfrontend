import type { ApiError } from "@/lib/axios";

export const hasStatus = (err: unknown, status: number) => (err as ApiError).status === status;

// A 401 reaching the UI means the token refresh already failed, so the session is gone.
export const isUnauthorized = (err: unknown) => hasStatus(err, 401);

export const isNotFound = (err: unknown) => hasStatus(err, 404);

export const errorMessage = (err: unknown, fallback: string) =>
  (err as ApiError).message ?? fallback;
