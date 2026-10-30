import type { AuthResponse, User } from "@/types/auth";

const ACCESS_TOKEN_KEY = "access_token";
const USER_KEY = "auth_user";
// Refresh tokens now live in an httpOnly cookie; this key is only removed for older sessions.
const LEGACY_REFRESH_TOKEN_KEY = "refresh_token";

const isBrowser = () => typeof window !== "undefined";

export function getAccessToken(): string | null {
  return isBrowser() ? window.localStorage.getItem(ACCESS_TOKEN_KEY) : null;
}

export function getStoredUser(): User | null {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function saveSession(session: AuthResponse): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
  window.localStorage.setItem(USER_KEY, JSON.stringify(session.user));
  window.localStorage.removeItem(LEGACY_REFRESH_TOKEN_KEY);
}

export function clearSession(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  window.localStorage.removeItem(LEGACY_REFRESH_TOKEN_KEY);
}
