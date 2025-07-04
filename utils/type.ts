import { ViewStyle } from "react-native";


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

export interface Group {
  _id: string;
  name: string;
  icon: string;
  description?: string;
  memberCount: number;
  totalExpenses: number;
}

export type ResponseType = {
  success: boolean;
  data?: any;
  msg?: string;
};

export type ImageUploadProps = {
  file?: any;
  onSelect: (file: any) => void;
  onClear: () => void;
  containerStyle?: ViewStyle;
  imageStyle?: ViewStyle;
  placeholder?: string;
};