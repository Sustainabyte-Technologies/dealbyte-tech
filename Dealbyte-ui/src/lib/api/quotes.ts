import { apiClient } from './client';

export type QuoteStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';

export interface QuoteTeamMemberInput {
  manpowerRateId: string;
  siteDays: number;
  reportDays: number;
}

export interface QuoteInstrumentInput {
  instrumentRateId: string;
  siteDays: number;
}

export interface QuoteHardwareInput {
  hardwareItemId: string;
  qty: number;
}

export interface CreateQuoteInput {
  dealId?: string;
  clientName?: string;
  serviceId?: string;
  serviceName?: string;
  category?: string;
  proposalNumber?: string;
  proposalDate?: string;
  clientLogo?: string;
  siteDays: number;
  reportDays: number;
  teamMembers: QuoteTeamMemberInput[];
  instruments?: QuoteInstrumentInput[];
  hardware?: QuoteHardwareInput[];
  travelKms?: number;
  travelRatePerKm?: number;
  foodRatePerPersonDay?: number;
  foodTravelCost?: number;
  marginPct?: number;
  bufferPct?: number;
  lineItems?: any[];
  finalQuote?: number;
}

export interface QuoteLineItem {
  id: string;
  quoteId: string;
  type: 'MANPOWER' | 'INSTRUMENT' | 'HARDWARE' | 'TRAVEL';
  refId: string | null;
  description: string;
  qty: number;
  unitRate: number;
  total: number;
}

export interface Quote {
  id: string;
  dealId: string;
  serviceId: string;
  proposalNumber?: string | null;
  proposalDate?: string | null;
  clientLogo?: string | null;
  siteDays: number;
  reportDays: number;
  manpowerCost: number;
  instrumentCost: number;
  travelKms?: number | null;
  travelRatePerKm?: number | null;
  foodRatePerPersonDay?: number | null;
  foodTravelCost: number;
  subtotal: number;
  marginPct: number;
  marginAmount: number;
  bufferPct: number;
  bufferAmount: number;
  finalQuote: number;
  negotiationMarginPct?: number | null;
  status: QuoteStatus;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  lineItems?: QuoteLineItem[];
  deal?: { id: string; clientName: string; service?: { name: string }; owner?: { name: string } };
  service?: { id: string; name: string };
  createdBy?: { id: string; name: string; email: string };
  approvalRequests?: Array<{
    id: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    reason?: string;
    approver?: { name: string };
  }>;
  breakdown?: {
    requiresApproval: boolean;
    approvalReasons: string[];
  };
}

export const quotesApi = {
  create: async (data: CreateQuoteInput): Promise<Quote> => {
    const res = await apiClient.post<Quote>('/quotes', data);
    return res.data;
  },
  getOne: async (id: string): Promise<Quote> => {
    const res = await apiClient.get<Quote>(`/quotes/${id}`);
    return res.data;
  },
  update: async (id: string, data: Partial<CreateQuoteInput>): Promise<Quote> => {
    const res = await apiClient.patch<Quote>(`/quotes/${id}`, data);
    return res.data;
  },
  submitForApproval: async (id: string): Promise<{ message: string; approverId: string }> => {
    const res = await apiClient.post<{ message: string; approverId: string }>(`/quotes/${id}/submit-for-approval`);
    return res.data;
  },
  negotiate: async (id: string, negotiationMarginPct: number): Promise<Quote> => {
    const res = await apiClient.post<Quote>(`/quotes/${id}/negotiate`, { negotiationMarginPct });
    return res.data;
  },
};
