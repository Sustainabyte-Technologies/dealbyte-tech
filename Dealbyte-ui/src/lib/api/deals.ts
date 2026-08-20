import { apiClient } from './client';

export type DealStage = 'ENQUIRY' | 'QUOTED' | 'NEGOTIATION' | 'WON' | 'LOST';

export interface Deal {
  id: string;
  clientName: string;
  serviceId: string;
  ownerId: string;
  stage: DealStage;
  value?: number;
  createdAt: string;
  updatedAt: string;
  service?: { id: string; name: string; category?: string };
  owner?: { id: string; name: string; email: string };
  _count?: { quotes: number; proposals: number };
}

export interface CreateDealInput {
  clientName: string;
  serviceId: string;
  value?: number;
}

export const dealsApi = {
  getAll: async (params?: { stage?: DealStage; ownerId?: string }): Promise<Deal[]> => {
    const res = await apiClient.get<Deal[]>('/deals', { params });
    return res.data;
  },
  getOne: async (id: string): Promise<Deal> => {
    const res = await apiClient.get<Deal>(`/deals/${id}`);
    return res.data;
  },
  create: async (data: CreateDealInput): Promise<Deal> => {
    const res = await apiClient.post<Deal>('/deals', data);
    return res.data;
  },
  update: async (id: string, data: Partial<{ clientName: string; serviceId: string; stage: DealStage; value: number }>): Promise<Deal> => {
    const res = await apiClient.patch<Deal>(`/deals/${id}`, data);
    return res.data;
  },
};
