export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  fullName: string;
  email: string;
  expiresInMs: number;
}

export interface AuthUser {
  fullName: string;
  email: string;
}
