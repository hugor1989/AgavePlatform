import api, { setAuthToken, clearAuthToken } from '@/lib/api';

export interface LoginData {
  email: string;
  password: string;
}

export interface Admin {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  data: {
    admin: Admin;
  };
  message: string;
  status_code: number;
}

export const authService = {
  async login(credentials: LoginData): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/admin/login', credentials);

    if (response.data.success && response.data.token) {
      setAuthToken(response.data.token);
    }

    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/admin/logout');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      clearAuthToken();
    }
  },

  async getProfile(): Promise<Admin> {
    const response = await api.get<{ data: Admin }>('/profile');
    return response.data.data;
  },

  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('auth_token');
    }
    return false;
  },
};
