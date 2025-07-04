

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  avatar?: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
  };
  errors?: any[];
  timestamp: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: any[];
  timestamp: string;
}

export type ErrorType = 'error' | 'warning' | 'success' | 'info';

export type ErrorState ={
  visible: boolean;
  message: string;
  type: ErrorType;
  title?: string;
}
