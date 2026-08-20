import { apiClient } from './client';

export interface AuditLogItem {
  id: string;
  userId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | string;
  entityType: string;
  entityId: string;
  details?: Record<string, any> | null;
  timestamp: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const auditLogsApi = {
  getAll: async (params?: {
    search?: string;
    action?: string;
    entityType?: string;
  }): Promise<AuditLogItem[]> => {
    const res = await apiClient.get<AuditLogItem[]>('/audit-logs', { params });
    return res.data;
  },
};
