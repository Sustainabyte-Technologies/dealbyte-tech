import { apiClient } from './client';

export interface FunnelStage {
  stage: 'ENQUIRY' | 'QUOTED' | 'NEGOTIATION' | 'WON' | 'LOST';
  _count: number;
  _sum: { value: number | null };
}

export interface OverviewData {
  funnel: FunnelStage[];
  dealsWonThisMonth: number;
  activePipeline: {
    totalValue: number;
    count: number;
  };
  recentDeals: Array<{
    id: string;
    clientName: string;
    stage: string;
    value?: number;
    createdAt: string;
    service?: { name: string };
    owner?: { name: string };
  }>;
}

export interface MarginByService {
  serviceId: string;
  serviceName: string;
  avgMarginPct: number;
  quoteCount: number;
  totalValue: number;
}

export interface CostingMarginData {
  marginByService: MarginByService[];
  lowMarginQuotes: Array<{
    id: string;
    marginPct: number;
    finalQuote: number;
    deal?: { clientName: string; service?: { name: string } };
    createdBy?: { name: string };
  }>;
  threshold: number;
}

export interface ProposalTrackerItem {
  id: string;
  status: 'DRAFT' | 'REVIEWED' | 'SENT';
  generatedAt: string;
  isStale: boolean;
  daysSinceGenerated: number;
  deal?: {
    clientName: string;
    service?: { name: string };
    owner?: { id: string; name: string };
  };
  quote?: { id: string; finalQuote: number };
}

export interface ServicePerformanceItem {
  serviceId: string;
  serviceName: string;
  category: string;
  totalDeals: number;
  wonDeals: number;
  lostDeals: number;
  winRate: number;
  totalValue: number;
  wonValue: number;
}

export const dashboardApi = {
  getOverview: async (): Promise<OverviewData> => {
    const res = await apiClient.get<OverviewData>('/dashboard/overview');
    return res.data;
  },
  getCostingMargin: async (): Promise<CostingMarginData> => {
    const res = await apiClient.get<CostingMarginData>('/dashboard/costing-margin');
    return res.data;
  },
  getProposalTracker: async (): Promise<ProposalTrackerItem[]> => {
    const res = await apiClient.get<ProposalTrackerItem[]>('/dashboard/proposal-tracker');
    return res.data;
  },
  getServicePerformance: async (): Promise<ServicePerformanceItem[]> => {
    const res = await apiClient.get<ServicePerformanceItem[]>('/dashboard/service-performance');
    return res.data;
  },
};
