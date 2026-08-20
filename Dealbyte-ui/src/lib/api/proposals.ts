import { apiClient } from './client';

export type ProposalStatus = 'DRAFT' | 'REVIEWED' | 'SENT';

export interface Proposal {
  id: string;
  quoteId: string;
  dealId: string;
  proposalNumber?: string | null;
  proposalDate?: string | null;
  clientLogo?: string | null;
  templateId?: string | null;
  status: ProposalStatus;
  fileUrl?: string | null;
  generatedAt: string;
  sentAt?: string | null;
  quote?: {
    id: string;
    finalQuote: number;
    status: string;
    lineItems?: Array<{ description: string; qty: number; unitRate: number; total: number }>;
  };
  deal?: {
    clientName: string;
    service?: { name: string };
    owner?: { name: string; email: string };
  };
  template?: { name: string; fileUrl: string };
}

export const proposalsApi = {
  generate: async (quoteId: string, templateId?: string): Promise<Proposal> => {
    const res = await apiClient.post<Proposal>('/proposals/generate', { quoteId, templateId });
    return res.data;
  },
  getAll: async (): Promise<Proposal[]> => {
    const res = await apiClient.get<Proposal[]>('/proposals');
    return res.data;
  },
  getOne: async (id: string): Promise<Proposal> => {
    const res = await apiClient.get<Proposal>(`/proposals/${id}`);
    return res.data;
  },
  updateStatus: async (id: string, status: ProposalStatus): Promise<Proposal> => {
    const res = await apiClient.patch<Proposal>(`/proposals/${id}/status`, { status });
    return res.data;
  },
  update: async (
    id: string,
    data: {
      proposalNumber?: string;
      status?: ProposalStatus;
      clientName?: string;
      proposalDate?: string;
      clientLogo?: string;
    },
  ): Promise<Proposal> => {
    const res = await apiClient.patch<Proposal>(`/proposals/${id}`, data);
    return res.data;
  },
};
