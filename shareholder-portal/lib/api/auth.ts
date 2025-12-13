import { apiClient } from './client';
import { LoginRequest, LoginResponse, RegisterRequest } from '../types/api';

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/api/auth/login', data);
  },

  register: async (data: RegisterRequest): Promise<{ message: string; user: any }> => {
    return apiClient.post('/api/auth/register', data);
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },

  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  },

  isAuthenticated: (): boolean => {
    return !!authApi.getToken();
  },
};