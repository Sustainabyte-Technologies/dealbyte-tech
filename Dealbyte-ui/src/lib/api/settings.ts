import { apiClient } from './client';

export interface SystemSetting {
  id: string;
  key: string;
  value: string;
  label: string;
}

export const settingsApi = {
  getAll: async (): Promise<SystemSetting[]> => {
    const res = await apiClient.get<SystemSetting[]>('/settings');
    return res.data;
  },
  update: async (key: string, value: string): Promise<SystemSetting> => {
    const res = await apiClient.patch<SystemSetting>(`/settings/${key}`, { value });
    return res.data;
  },
  bulkUpdate: async (updates: Array<{ key: string; value: string }>): Promise<SystemSetting[]> => {
    const res = await apiClient.patch<SystemSetting[]>('/settings', updates);
    return res.data;
  },
};
