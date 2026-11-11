export interface AuthResponse {
  userId: string;
  message: string;
  success: boolean;
  errorCode: string | null;
}