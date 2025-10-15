import api, { setAuthToken, clearAuthToken } from '@/lib/api';

export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  data: User;
  message: string;
  status_code: number;
}

export const authService = {
  async login(credentials: LoginData): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/admin/login', credentials);

    if (response.data.success && response.data.token) {
      setAuthToken(response.data.token);

      // 👇 Guardar la información del usuario
      const { email, name, role } = response.data.data;
      localStorage.setItem('auth_email', email);
      localStorage.setItem('auth_name', name);
      localStorage.setItem('auth_role', role);
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

  async getProfile(): Promise<User> {
    const response = await api.get<{ data: User }>('/profile');
    return response.data.data;
  },

  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('auth_token');
    }
    return false;
  },
};
