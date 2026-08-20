import { apiClient } from './client';

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ApprovalRequest {
  id: string;
  quoteId: string;
  requestedById: string;
  approverId: string;
  reason?: string;
  status: ApprovalStatus;
  decidedAt?: string;
  createdAt: string;
  quote?: {
    id: string;
    finalQuote: number;
    marginPct: number;
    deal?: { clientName: string; service?: { name: string } };
    createdBy?: { name: string; email: string };
  };
  requestedBy?: { id: string; name: string; email: string };
  approver?: { id: string; name: string; email: string };
}

export const approvalsApi = {
  getPending: async (approverId?: string): Promise<ApprovalRequest[]> => {
    const res = await apiClient.get<ApprovalRequest[]>('/approvals', {
      params: approverId ? { approverId } : undefined,
    });
    return res.data;
  },
  approve: async (id: string, reason?: string): Promise<{ message: string }> => {
    const res = await apiClient.post<{ message: string }>(`/approvals/${id}/approve`, { reason });
    return res.data;
  },
  reject: async (id: string, reason?: string): Promise<{ message: string }> => {
    const res = await apiClient.post<{ message: string }>(`/approvals/${id}/reject`, { reason });
    return res.data;
  },
};
