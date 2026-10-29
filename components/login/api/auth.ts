import api from "@/lib/axios";
import { clearSession, saveSession } from "@/lib/auth/token-storage";
import type { AuthResponse, LoginInput, Profile, RegisterInput } from "@/types/auth";

export async function login(input: LoginInput): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/login", {
    email: input.email.trim().toLowerCase(),
    password: input.password,
  });
  saveSession(data);
  return data;
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/register", {
    ...input,
    email: input.email.trim().toLowerCase(),
  });
  saveSession(data);
  return data;
}

export async function getProfile(): Promise<Profile> {
  const { data } = await api.get<Profile>("/auth/profile");
  return data;
}

export function logout(): void {
  clearSession();
}
