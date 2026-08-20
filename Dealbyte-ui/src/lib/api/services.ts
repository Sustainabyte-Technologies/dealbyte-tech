import { apiClient } from './client';

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  description?: string;
  hasCostingTemplate: boolean;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    deals: number;
    quotes: number;
    contentBlocks?: number;
  };
}

export interface CreateServiceInput {
  name: string;
  category: string;
  description?: string;
  hasCostingTemplate?: boolean;
}

export const servicesApi = {
  getAll: async (category?: string): Promise<ServiceItem[]> => {
    const res = await apiClient.get<ServiceItem[]>('/services', {
      params: category ? { category } : undefined,
    });
    return res.data;
  },

  getOne: async (id: string): Promise<ServiceItem> => {
    const res = await apiClient.get<ServiceItem>(`/services/${id}`);
    return res.data;
  },

  create: async (data: CreateServiceInput): Promise<ServiceItem> => {
    const res = await apiClient.post<ServiceItem>('/services', data);
    return res.data;
  },

  update: async (id: string, data: Partial<CreateServiceInput>): Promise<ServiceItem> => {
    const res = await apiClient.patch<ServiceItem>(`/services/${id}`, data);
    return res.data;
  },
};
