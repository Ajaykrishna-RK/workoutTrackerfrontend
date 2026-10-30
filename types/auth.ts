export interface User {
  id: string;
  name: string | null;
  email: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  name?: string;
}

export interface Profile {
  userId: string;
  email: string;
}

// The refresh token is not in the body; the backend sets it as an httpOnly cookie.
export interface AuthResponse {
  accessToken: string;
  tokenType: "Bearer";
  expiresIn: string;
  user: User;
}
