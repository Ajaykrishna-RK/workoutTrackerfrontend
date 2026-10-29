import type { ApiError } from "@/lib/axios";

export const hasStatus = (err: unknown, status: number) => (err as ApiError).status === status;

export const isUnauthorized = (err: unknown) => hasStatus(err, 401);

export const isNotFound = (err: unknown) => hasStatus(err, 404);

export const errorMessage = (err: unknown, fallback: string) =>
  (err as ApiError).message ?? fallback;
