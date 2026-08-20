import { apiClient } from './client';

export interface ManpowerRate {
  id: string;
  role: string;
  ratePerDay: number;
  currency: string;
  effectiveFrom: string;
  _count?: { teamMembers: number };
}

export interface InstrumentRate {
  id: string;
  instrumentName: string;
  rentalRatePerDay: number;
  effectiveFrom?: string;
}

export interface HardwareItem {
  id: string;
  name: string;
  unitCost: number;
  category: string;
}

export const rateCardsApi = {
  // Manpower
  getManpower: async (): Promise<ManpowerRate[]> => {
    const res = await apiClient.get<ManpowerRate[]>('/rate-cards/manpower');
    return res.data;
  },
  createManpower: async (data: { role: string; ratePerDay: number; currency?: string }): Promise<ManpowerRate> => {
    const res = await apiClient.post<ManpowerRate>('/rate-cards/manpower', data);
    return res.data;
  },
  updateManpower: async (id: string, data: Partial<{ role: string; ratePerDay: number }>): Promise<ManpowerRate> => {
    const res = await apiClient.patch<ManpowerRate>(`/rate-cards/manpower/${id}`, data);
    return res.data;
  },
  deleteManpower: async (id: string): Promise<void> => {
    await apiClient.delete(`/rate-cards/manpower/${id}`);
  },

  // Instruments
  getInstruments: async (): Promise<InstrumentRate[]> => {
    const res = await apiClient.get<InstrumentRate[]>('/rate-cards/instruments');
    return res.data;
  },
  createInstrument: async (data: { instrumentName: string; rentalRatePerDay: number }): Promise<InstrumentRate> => {
    const res = await apiClient.post<InstrumentRate>('/rate-cards/instruments', data);
    return res.data;
  },
  updateInstrument: async (id: string, data: Partial<{ instrumentName: string; rentalRatePerDay: number }>): Promise<InstrumentRate> => {
    const res = await apiClient.patch<InstrumentRate>(`/rate-cards/instruments/${id}`, data);
    return res.data;
  },
  deleteInstrument: async (id: string): Promise<void> => {
    await apiClient.delete(`/rate-cards/instruments/${id}`);
  },

  // Hardware
  getHardware: async (): Promise<HardwareItem[]> => {
    const res = await apiClient.get<HardwareItem[]>('/rate-cards/hardware');
    return res.data;
  },
  createHardware: async (data: { name: string; unitCost: number; category: string }): Promise<HardwareItem> => {
    const res = await apiClient.post<HardwareItem>('/rate-cards/hardware', data);
    return res.data;
  },
  updateHardware: async (id: string, data: Partial<{ name: string; unitCost: number; category: string }>): Promise<HardwareItem> => {
    const res = await apiClient.patch<HardwareItem>(`/rate-cards/hardware/${id}`, data);
    return res.data;
  },
  deleteHardware: async (id: string): Promise<void> => {
    await apiClient.delete(`/rate-cards/hardware/${id}`);
  },
};
