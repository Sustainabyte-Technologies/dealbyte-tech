import { apiClient, setAccessToken, setRefreshToken } from './client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'ESTIMATION_LEAD' | 'SALES_EXECUTIVE' | 'MANAGER';
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const res = await apiClient.post<LoginResponse>('/auth/login', { email, password });
    setAccessToken(res.data.accessToken);
    setRefreshToken(res.data.refreshToken);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dealbyte_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // ignore
    } finally {
      setAccessToken(null);
      setRefreshToken(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('dealbyte_user');
      }
    }
  },

  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem('dealbyte_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
};
