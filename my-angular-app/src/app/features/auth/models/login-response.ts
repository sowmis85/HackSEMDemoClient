export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  role: string;
  userId: string;
  success: boolean;
  message?: string;
}