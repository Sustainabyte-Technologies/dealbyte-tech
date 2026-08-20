import { apiClient } from './client';

export type UserRole = 'ADMIN' | 'MANAGER' | 'ESTIMATION_LEAD' | 'SALES_EXECUTIVE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const res = await apiClient.get<User[]>('/users');
    return res.data;
  },

  getOne: async (id: string): Promise<User> => {
    const res = await apiClient.get<User>(`/users/${id}`);
    return res.data;
  },

  create: async (data: CreateUserData): Promise<User> => {
    const res = await apiClient.post<User>('/users', data);
    return res.data;
  },

  update: async (id: string, data: UpdateUserData): Promise<User> => {
    const res = await apiClient.patch<User>(`/users/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const res = await apiClient.delete<{ message: string }>(`/users/${id}`);
    return res.data;
  },
};
