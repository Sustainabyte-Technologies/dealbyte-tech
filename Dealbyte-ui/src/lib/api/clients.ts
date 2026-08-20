import { apiClient } from './client';

export interface ClientItem {
  id: string;
  name: string;
  logo?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export const clientsApi = {
  getAll: async (): Promise<ClientItem[]> => {
    const res = await apiClient.get<ClientItem[]>('/clients');
    return res.data;
  },
  create: async (name: string, logo?: string): Promise<ClientItem> => {
    const res = await apiClient.post<ClientItem>('/clients', { name, logo });
    return res.data;
  },
  update: async (id: string, name?: string, logo?: string): Promise<ClientItem> => {
    const res = await apiClient.patch<ClientItem>(`/clients/${id}`, { name, logo });
    return res.data;
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/clients/${id}`);
  },
};
