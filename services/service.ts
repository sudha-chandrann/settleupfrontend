import axios, { AxiosInstance, AxiosError, isAxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiError, AuthResponse, LoginData, RegisterData, User } from '@/utils/type';


const CONFIG = {
  API_BASE_URL: 'http://10.225.96.79:3000/api/v1',
  TOKEN_KEY: 'auth_token',
  USER_KEY: 'user_data',
  REQUEST_TIMEOUT: 10000,
  MAX_RETRIES: 3,
};


class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: CONFIG.API_BASE_URL,
      timeout: CONFIG.REQUEST_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem(CONFIG.TOKEN_KEY);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          await this.clearAuthData();
        }
        return Promise.reject(error);
      }
    );
  }

  private async clearAuthData() {
    try {
      await AsyncStorage.multiRemove([CONFIG.TOKEN_KEY, CONFIG.USER_KEY]);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }

  public getInstance(): AxiosInstance {
    return this.instance;
  }
}

class AuthService {
  private apiClient: AxiosInstance;

  constructor() {
    this.apiClient = new ApiClient().getInstance();
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await this.apiClient.post<AuthResponse>('/users/auth/register', data);
      return response.data;
    } catch (error) {
      return this.handleError(error, 'Registration failed');
    }
  }

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await this.apiClient.post<AuthResponse>('/users/auth/login', data);

      if (response.data.success && response.data.data) {
        await this.storeAuthData(response.data.data.token, response.data.data.user);
      }

      return response.data;
    } catch (error) {
      return this.handleError(error, 'Login failed');
    }
  }

  async requestEmailVerificationCode(data: { email: string }): Promise<AuthResponse> {
    try {
      const response = await this.apiClient.post<AuthResponse>(
        '/users/auth/send-verification-code',
        data
      );
      return response.data;
    } catch (error) {
      return this.handleError(error, 'Failed to send verification code.');
    }
  }

  async confirmEmailVerification(data: { email: string; code: string }): Promise<AuthResponse> {
    try {
      const response = await this.apiClient.post<AuthResponse>(
        '/users/auth/verify-email',
        data
      );
      return response.data;
    } catch (error) {
      return this.handleError(error, 'Email verification failed.');
    }
  }

  async logout(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([CONFIG.TOKEN_KEY, CONFIG.USER_KEY]);
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Failed to logout');
    }
  }

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(CONFIG.TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  async storeToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(CONFIG.TOKEN_KEY, token);
    } catch (error) {
      console.error('Error storing token:', error);
      throw new Error('Failed to store authentication token');
    }
  }

  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CONFIG.TOKEN_KEY);
    } catch (error) {
      console.error('Error removing token:', error);
      throw new Error('Failed to remove authentication token');
    }
  }


  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(CONFIG.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async storeUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(CONFIG.USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error storing user data:', error);
      throw new Error('Failed to store user data');
    }
  }

  async removeUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CONFIG.USER_KEY);
    } catch (error) {
      console.error('Error removing user data:', error);
      throw new Error('Failed to remove user data');
    }
  }


  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getToken();
      const user = await this.getCurrentUser();
      return !!(token && user);
    } catch (error) {
      console.error('Error checking authentication status:', error);
      return false;
    }
  }

  private async storeAuthData(token: string, user: User): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        [CONFIG.TOKEN_KEY, token],
        [CONFIG.USER_KEY, JSON.stringify(user)],
      ]);
    } catch (error) {
      console.error('Error storing auth data:', error);
      throw new Error('Failed to store authentication data');
    }
  }

  private handleError(error: any, defaultMessage: string): AuthResponse {

    if (isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiError>;

      if (axiosError.response?.data) {
        return {
          success: false,
          message: axiosError.response.data.message || defaultMessage,
          errors: axiosError.response.data.errors,
          timestamp: new Date().toISOString(),
        };
      }

      if (axiosError.code === 'ECONNABORTED') {
        return {
          success: false,
          message: 'Request timeout. Please check your connection.',
          timestamp: new Date().toISOString(),
        };
      }

      if (axiosError.message === 'Network Error') {
        return {
          success: false,
          message: 'Network error. Please check your internet connection.',
          timestamp: new Date().toISOString(),
        };
      }
    }

    return {
      success: false,
      message: error.message || defaultMessage,
      timestamp: new Date().toISOString(),
    };
  }
  
}



export const authService = new AuthService();



