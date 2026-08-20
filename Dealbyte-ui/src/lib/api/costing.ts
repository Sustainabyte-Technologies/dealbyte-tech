import { apiClient } from './client';

export interface CostingTemplateItem {
  id: string;
  serviceId?: string;
  serviceName: string;
  categoryName: string;
  name: string;
  manpowerRows: any[];
  instrumentRows: any[];
  extraExpenseRows: any[];
  siteWorkingDays: number;
  reportWorkingDays: number;
  marginPct: number;
  bufferPct: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SaveCostingTemplateInput {
  serviceId?: string;
  serviceName: string;
  categoryName: string;
  name: string;
  manpowerRows?: any[];
  instrumentRows?: any[];
  extraExpenseRows?: any[];
  siteWorkingDays?: number;
  reportWorkingDays?: number;
  marginPct: number;
  bufferPct: number;
  isEms?: boolean;
  emsHardwareRows?: any[];
  emsManpowerRows?: any[];
  emsPlatformRows?: any[];
  emsRecurringRows?: any[];
}

export interface CostingSheetItem {
  id: string;
  _id?: string;
  clientId?: string;
  clientName: string;
  serviceCategory: string;
  subService: string;
  serviceId?: string;
  templateId?: string;
  projectName?: string;
  siteName?: string;
  stationType?: string;
  outstationStartLocation?: string;
  outstationEndLocation?: string;
  scopeDetails?: string;
  manpowerRows?: any[];
  instrumentRows?: any[];
  extraExpenseRows?: any[];
  siteWorkingDays?: number;
  reportWorkingDays?: number;
  totalManpowerCost?: number;
  totalInstrumentCost?: number;
  totalExtraCost?: number;
  subtotalCost: number;
  marginPct: number;
  marginAmount?: number;
  bufferPct: number;
  bufferAmount?: number;
  finalQuote: number;
  status?: string;
  isEms?: boolean;
  emsHardwareRows?: any[];
  emsManpowerRows?: any[];
  emsPlatformRows?: any[];
  emsRecurringRows?: any[];
  client?: any;
  service?: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface SaveCostingSheetInput {
  id?: string;
  clientId?: string;
  clientName: string;
  serviceCategory: string;
  subService: string;
  serviceId?: string;
  templateId?: string;
  projectName?: string;
  siteName?: string;
  stationType?: string;
  outstationStartLocation?: string;
  outstationEndLocation?: string;
  scopeDetails?: string;
  manpowerRows?: any[];
  instrumentRows?: any[];
  extraExpenseRows?: any[];
  siteWorkingDays?: number;
  reportWorkingDays?: number;
  totalManpowerCost?: number;
  totalInstrumentCost?: number;
  totalExtraCost?: number;
  subtotalCost: number;
  marginPct: number;
  marginAmount?: number;
  bufferPct: number;
  bufferAmount?: number;
  finalQuote: number;
  status?: string;
  isEms?: boolean;
  emsHardwareRows?: any[];
  emsManpowerRows?: any[];
  emsPlatformRows?: any[];
  emsRecurringRows?: any[];
}

export interface GetCostingSheetsParams {
  id?: string;
  clientId?: string;
  clientName?: string;
  serviceCategory?: string;
  subService?: string;
  projectName?: string;
  stationType?: string;
}

export const costingApi = {
  // Templates
  saveTemplate: async (data: SaveCostingTemplateInput): Promise<CostingTemplateItem> => {
    const res = await apiClient.post<CostingTemplateItem>('/costing/templates', data);
    return res.data;
  },

  getTemplates: async (): Promise<CostingTemplateItem[]> => {
    const res = await apiClient.get<CostingTemplateItem[]>('/costing/templates');
    return res.data;
  },

  getTemplateByService: async (serviceIdOrName: string): Promise<CostingTemplateItem | null> => {
    if (!serviceIdOrName) return null;
    try {
      const res = await apiClient.get<CostingTemplateItem>(
        `/costing/templates/by-service/${encodeURIComponent(serviceIdOrName)}`
      );
      return res.data;
    } catch {
      return null;
    }
  },

  deleteTemplate: async (id: string): Promise<void> => {
    await apiClient.delete(`/costing/templates/${id}`);
  },

  // Saved Costing Sheets
  saveSheet: async (data: SaveCostingSheetInput): Promise<CostingSheetItem> => {
    if (data.id) {
      const res = await apiClient.put<CostingSheetItem>(`/costing/sheets/${data.id}`, data);
      return res.data;
    }
    const res = await apiClient.post<CostingSheetItem>('/costing/sheets', data);
    return res.data;
  },

  getSheets: async (
    params?: GetCostingSheetsParams | string,
    subServiceParam?: string
  ): Promise<CostingSheetItem[]> => {
    const queryParams =
      typeof params === 'string'
        ? { clientName: params, subService: subServiceParam }
        : params;
    const res = await apiClient.get<CostingSheetItem[]>('/costing/sheets', {
      params: queryParams,
    });
    return res.data;
  },

  getSheetById: async (id: string): Promise<CostingSheetItem> => {
    const res = await apiClient.get<CostingSheetItem>(`/costing/sheets/${id}`);
    return res.data;
  },

  deleteSheet: async (id: string): Promise<void> => {
    await apiClient.delete(`/costing/sheets/${id}`);
  },

  deleteByMapping: async (params: {
    clientName?: string;
    serviceCategory?: string;
    subService?: string;
    projectName?: string;
  }): Promise<{ deletedCount: number }> => {
    const res = await apiClient.delete<{ deletedCount: number }>('/costing/sheets/by-mapping', {
      params,
    });
    return res.data;
  },

  // ─── DEDICATED FORMAT APIS ───
  airAudit: {
    saveTemplate: async (data: any) => (await apiClient.post('/costing/air-audit/template', data)).data,
    getTemplate: async () => (await apiClient.get('/costing/air-audit/template')).data,
    saveSheet: async (data: any) => {
      if (data.id) {
        return (await apiClient.put(`/costing/air-audit/sheets/${data.id}`, data)).data;
      }
      return (await apiClient.post('/costing/air-audit/sheets', data)).data;
    },
    getSheets: async (clientName?: string) => (await apiClient.get('/costing/air-audit/sheets', { params: { clientName } })).data,
    deleteSheet: async (id: string) => (await apiClient.delete(`/costing/air-audit/sheets/${id}`)).data,
  },
  energyAudit: {
    saveTemplate: async (data: any) => (await apiClient.post('/costing/energy-audit/template', data)).data,
    getTemplate: async () => (await apiClient.get('/costing/energy-audit/template')).data,
    saveSheet: async (data: any) => {
      if (data.id) {
        return (await apiClient.put(`/costing/energy-audit/sheets/${data.id}`, data)).data;
      }
      return (await apiClient.post('/costing/energy-audit/sheets', data)).data;
    },
    getSheets: async (clientName?: string) => (await apiClient.get('/costing/energy-audit/sheets', { params: { clientName } })).data,
    deleteSheet: async (id: string) => (await apiClient.delete(`/costing/energy-audit/sheets/${id}`)).data,
  },
  airAuditRectification: {
    saveTemplate: async (data: any) => (await apiClient.post('/costing/air-audit-rectification/template', data)).data,
    getTemplate: async () => (await apiClient.get('/costing/air-audit-rectification/template')).data,
    saveSheet: async (data: any) => {
      if (data.id) {
        return (await apiClient.put(`/costing/air-audit-rectification/sheets/${data.id}`, data)).data;
      }
      return (await apiClient.post('/costing/air-audit-rectification/sheets', data)).data;
    },
    getSheets: async (clientName?: string) => (await apiClient.get('/costing/air-audit-rectification/sheets', { params: { clientName } })).data,
    deleteSheet: async (id: string) => (await apiClient.delete(`/costing/air-audit-rectification/sheets/${id}`)).data,
  },
  ems: {
    saveTemplate: async (data: any) => (await apiClient.post('/costing/ems/template', data)).data,
    getTemplate: async () => (await apiClient.get('/costing/ems/template')).data,
    saveSheet: async (data: any) => {
      if (data.id) {
        return (await apiClient.put(`/costing/ems/sheets/${data.id}`, data)).data;
      }
      return (await apiClient.post('/costing/ems/sheets', data)).data;
    },
    getSheets: async (clientName?: string) => (await apiClient.get('/costing/ems/sheets', { params: { clientName } })).data,
    deleteSheet: async (id: string) => (await apiClient.delete(`/costing/ems/sheets/${id}`)).data,
  },
};
