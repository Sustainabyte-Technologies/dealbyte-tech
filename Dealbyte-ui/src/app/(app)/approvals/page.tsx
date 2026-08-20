'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, XCircle, Clock, ShieldAlert, FileText, ArrowRight, FileSpreadsheet, Trash2, Search, Filter, AlertTriangle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { approvalsApi, ApprovalRequest } from '@/lib/api/approvals';
import { costingApi } from '@/lib/api/costing';
import { useAuth } from '@/providers/AuthProvider';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function ApprovalsPage() {
  const queryClient = useQueryClient();
  const { hasRole } = useAuth();
  const isManager = hasRole('MANAGER', 'ADMIN');

  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [decisionReason, setDecisionReason] = useState('');
  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT' | null>(null);

  const [activeCostingSheet, setActiveCostingSheet] = useState<any>(null);
  const [isFetchingSheet, setIsFetchingSheet] = useState(false);

  // Costing Sheet Delete State
  const [sheetToDelete, setSheetToDelete] = useState<any | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Filters State for Saved Costing Sheets
  const [clientFilter, setClientFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleViewCostingSheet = async (clientName?: string, subService?: string) => {
    if (!clientName) {
      toast.error('Client name is missing on this quote request');
      return;
    }
    setIsFetchingSheet(true);
    try {
      const sheets = await costingApi.getSheets(clientName, subService);
      if (sheets.length === 0) {
        toast.error(`No saved costing sheet found for client "${clientName}" under "${subService || 'any'}"`);
      } else {
        // Show the latest matching costing sheet
        setActiveCostingSheet(sheets[0]);
      }
    } catch (err: any) {
      toast.error('Failed to load costing sheet details');
    } finally {
      setIsFetchingSheet(false);
    }
  };

  const { data: pendingRequests = [], isLoading, refetch } = useQuery({
    queryKey: ['approvals-pending'],
    queryFn: () => approvalsApi.getPending(),
    enabled: isManager,
  });

  const [activeTab, setActiveTab] = useState<'approvals' | 'costing-sheets'>('approvals');

  const { data: allSavedSheets = [], isLoading: isLoadingSheets } = useQuery({
    queryKey: ['all-saved-costing-sheets'],
    queryFn: async () => {
      const [generalSheets, airAuditSheets, energyAuditSheets, rectificationSheets] = await Promise.all([
        costingApi.getSheets().catch(() => []),
        costingApi.airAudit.getSheets().catch(() => []),
        costingApi.energyAudit.getSheets().catch(() => []),
        costingApi.airAuditRectification.getSheets().catch(() => []),
      ]);

      const formattedAir = (airAuditSheets || []).map((s: any) => ({
        ...s,
        subService: s.subService || 'Air Audit',
        serviceCategory: s.serviceCategory || 'Energy Audit Services',
      }));
      const formattedEnergy = (energyAuditSheets || []).map((s: any) => ({
        ...s,
        subService: s.subService || 'Energy Audit',
        serviceCategory: s.serviceCategory || 'Energy Audit Services',
      }));
      const formattedRect = (rectificationSheets || []).map((s: any) => ({
        ...s,
        subService: s.subService || 'Air Audit Rectification',
        serviceCategory: s.serviceCategory || 'Energy Audit Services',
      }));
      const formattedGeneral = (generalSheets || []).map((s: any) => ({
        ...s,
        subService: s.subService || 'Energy Management Solution',
        serviceCategory: s.serviceCategory || 'IoT & Controls',
      }));

      const combined = [...formattedGeneral, ...formattedAir, ...formattedEnergy, ...formattedRect];
      const seen = new Set();
      const unique: any[] = [];
      for (const item of combined) {
        const id = item.id || item._id;
        if (id && !seen.has(id)) {
          seen.add(id);
          unique.push(item);
        }
      }

      return unique.sort(
        (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
    enabled: isManager,
  });

  // Filtered Sheets
  const filteredSavedSheets = React.useMemo(() => {
    return allSavedSheets.filter((sheet: any) => {
      const matchClient = !clientFilter || (sheet.clientName || '').toLowerCase().includes(clientFilter.toLowerCase());
      const matchCategory = !categoryFilter || (sheet.serviceCategory || '').toLowerCase().includes(categoryFilter.toLowerCase());
      const matchService = !serviceFilter || (sheet.subService || '').toLowerCase().includes(serviceFilter.toLowerCase());
      const matchSearch =
        !searchQuery ||
        (sheet.clientName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sheet.subService || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sheet.projectName || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchClient && matchCategory && matchService && matchSearch;
    });
  }, [allSavedSheets, clientFilter, categoryFilter, serviceFilter, searchQuery]);

  const uniqueClients = React.useMemo(() => {
    const names = allSavedSheets.map((s: any) => s.clientName).filter(Boolean);
    return Array.from(new Set(names)) as string[];
  }, [allSavedSheets]);

  const uniqueCategories = React.useMemo(() => {
    const cats = allSavedSheets.map((s: any) => s.serviceCategory).filter(Boolean);
    return Array.from(new Set(cats)) as string[];
  }, [allSavedSheets]);

  const uniqueServices = React.useMemo(() => {
    const services = allSavedSheets.map((s: any) => s.subService).filter(Boolean);
    return Array.from(new Set(services)) as string[];
  }, [allSavedSheets]);

  // Delete Single Costing Sheet Mutation
  const deleteSheetMutation = useMutation({
    mutationFn: async (sheet: any) => {
      await costingApi.deleteSheet(sheet.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-saved-costing-sheets'] });
      queryClient.invalidateQueries({ queryKey: ['costing-sheets-client'] });
      toast.success('Costing sheet deleted successfully!');
      setSheetToDelete(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete costing sheet');
    },
  });

  // Delete Matching Sheets by Mapping Mutation
  const deleteMappingMutation = useMutation({
    mutationFn: async () => {
      const res = await costingApi.deleteByMapping({
        clientName: clientFilter || searchQuery || undefined,
        serviceCategory: categoryFilter || undefined,
        subService: serviceFilter || undefined,
      });
      return res;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['all-saved-costing-sheets'] });
      queryClient.invalidateQueries({ queryKey: ['costing-sheets-client'] });
      toast.success(`Deleted ${data.deletedCount} matching costing sheet(s)!`);
      setIsBulkDeleting(false);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete matching sheets');
    },
  });

  const approveMutation = useMutation({
    mutationFn: (vars: { id: string; reason?: string }) => approvalsApi.approve(vars.id, vars.reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals-pending'] });
      toast.success('Quote approved successfully!');
      closeModal();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to approve quote');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (vars: { id: string; reason?: string }) => approvalsApi.reject(vars.id, vars.reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approvals-pending'] });
      toast.error('Quote approval rejected');
      closeModal();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to reject quote');
    },
  });

  const handleDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest || !actionType) return;

    if (actionType === 'APPROVE') {
      approveMutation.mutate({ id: selectedRequest.id, reason: decisionReason });
    } else {
      rejectMutation.mutate({ id: selectedRequest.id, reason: decisionReason });
    }
  };

  const closeModal = () => {
    setSelectedRequest(null);
    setActionType(null);
    setDecisionReason('');
  };

  if (!isManager) {
    return (
      <div className="bg-amber-50 p-8 rounded-2xl border border-amber-200 text-center max-w-md mx-auto my-12">
        <ShieldAlert className="h-12 w-12 text-amber-600 mx-auto mb-3" />
        <h3 className="font-bold text-amber-900">Access Restricted</h3>
        <p className="text-xs text-amber-700 mt-1">
          Only Managers and Admins can view and decide pending quote approval requests.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <CheckCircle2 className="h-6 w-6 text-indigo-600" /> Manager Approval Queue
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review and authorize quotes that breach minimum margin or high value thresholds
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200 gap-2 mb-4">
        <button
          onClick={() => setActiveTab('approvals')}
          className={`px-5 py-2.5 font-bold text-xs border-b-2 transition-all cursor-pointer ${
            activeTab === 'approvals'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Quote Approvals ({pendingRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('costing-sheets')}
          className={`px-5 py-2.5 font-bold text-xs border-b-2 transition-all cursor-pointer ${
            activeTab === 'costing-sheets'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Saved Costing Sheets ({allSavedSheets.length})
        </button>
      </div>

      {/* Queue List Tab */}
      {activeTab === 'approvals' && (
        <>
          {isLoading ? (
            <div className="p-12 text-center text-slate-400">Loading pending requests...</div>
          ) : pendingRequests.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 space-y-3">
              <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">Approval Queue is Clear!</h3>
              <p className="text-xs text-slate-500">All submitted quotes have been reviewed and authorized.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
                        {req.quote?.deal?.service?.name || 'Service Offering'}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        Requested {formatDate(req.createdAt)}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900">
                        {req.quote?.deal?.clientName || 'Client Name'}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Requested by <span className="font-medium text-slate-700">{req.requestedBy?.name}</span>
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                      <div>
                        <span className="text-slate-400 font-medium">Margin Pct:</span>
                        <p className="font-extrabold text-rose-600 text-sm mt-0.5">{req.quote?.marginPct}%</p>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium">Total Quote:</span>
                        <p className="font-extrabold text-slate-900 text-sm mt-0.5">
                          {formatCurrency(req.quote?.finalQuote)}
                        </p>
                      </div>
                    </div>

                    {req.reason && (
                      <p className="text-xs text-slate-600 bg-amber-50 p-2.5 rounded-lg border border-amber-100">
                        <span className="font-semibold text-amber-900">Trigger:</span> {req.reason}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/quotes/${req.quoteId}`}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                      >
                        <FileText className="h-3.5 w-3.5" /> View Breakdown
                      </Link>
                      <button
                        onClick={() => handleViewCostingSheet(req.quote?.deal?.clientName, req.quote?.deal?.service?.name)}
                        disabled={isFetchingSheet}
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 disabled:opacity-50 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <FileSpreadsheet className="h-3.5 w-3.5" /> View Costing Sheet
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedRequest(req);
                          setActionType('REJECT');
                        }}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs rounded-xl border border-rose-200 transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRequest(req);
                          setActionType('APPROVE');
                        }}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Saved Costing Sheets Tab */}
      {activeTab === 'costing-sheets' && (
        <div className="space-y-4">
          {/* Filter & Action Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              {/* Search Bar */}
              <div className="relative min-w-[200px] max-w-xs flex-1">
                <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search client, service, project..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Client Filter */}
              <select
                value={clientFilter}
                onChange={(e) => setClientFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="">All Clients ({uniqueClients.length})</option>
                {uniqueClients.map((client) => (
                  <option key={client} value={client}>
                    {client}
                  </option>
                ))}
              </select>

              {/* Service Filter */}
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="">All Services ({uniqueServices.length})</option>
                {uniqueServices.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>

              {/* Clear Filters */}
              {(searchQuery || clientFilter || categoryFilter || serviceFilter) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setClientFilter('');
                    setCategoryFilter('');
                    setServiceFilter('');
                  }}
                  className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-100 transition-colors cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Bulk / Mapping Delete Action Button */}
            {(clientFilter || serviceFilter || searchQuery) && filteredSavedSheets.length > 0 && (
              <button
                onClick={() => setIsBulkDeleting(true)}
                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete Matching ({filteredSavedSheets.length})
              </button>
            )}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {isLoadingSheets ? (
              <div className="p-12 text-center text-slate-400 animate-pulse">Loading saved costing sheets...</div>
            ) : filteredSavedSheets.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-3">
                <FileSpreadsheet className="h-12 w-12 text-slate-300 mx-auto animate-bounce" />
                <h3 className="font-bold text-slate-800 text-base">No Costing Sheets Found</h3>
                <p className="text-xs text-slate-500">
                  {searchQuery || clientFilter || serviceFilter
                    ? 'No costing sheets match your active filter criteria.'
                    : 'There are no costing sheets saved in the database yet.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                      <th className="p-4">Client Name</th>
                      <th className="p-4">Offering / Sub-Service</th>
                      <th className="p-4">Project Name</th>
                      <th className="p-4 text-right">Sustainabyte Cost</th>
                      <th className="p-4 text-center">Margin Pct</th>
                      <th className="p-4 text-right">Final Quote</th>
                      <th className="p-4">Saved Date</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredSavedSheets.map((sheet: any, idx: number) => (
                      <tr key={sheet.id || sheet._id || `sheet-${idx}`} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-bold text-slate-900">{sheet.clientName}</td>
                        <td className="p-4">
                          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                            {sheet.subService || 'Offering'}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500">{sheet.projectName || '—'}</td>
                        <td className="p-4 text-right">₹{formatCurrency(sheet.subtotalCost).replace('₹', '')}</td>
                        <td className="p-4 text-center text-indigo-700 font-bold">{sheet.marginPct}%</td>
                        <td className="p-4 text-right font-bold text-emerald-600">₹{formatCurrency(sheet.finalQuote).replace('₹', '')}</td>
                        <td className="p-4 text-slate-400">{formatDate(sheet.createdAt)}</td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setActiveCostingSheet(sheet)}
                              className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] rounded-lg border border-indigo-100 transition-colors cursor-pointer"
                              title="View Audit Breakdown"
                            >
                              View Audit Sheet
                            </button>
                            <Link
                              href={`/costing-sheet?id=${sheet.id}&subService=${sheet.subService}`}
                              className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-[10px] rounded-lg border border-amber-100 transition-colors inline-block"
                              title="Edit Costing Parameters"
                            >
                              Edit Costing
                            </Link>
                            <button
                              onClick={() => setSheetToDelete(sheet)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 rounded-lg border border-rose-100 transition-colors cursor-pointer"
                              title="Delete Costing Sheet"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Decision Modal */}
      {selectedRequest && actionType && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {actionType === 'APPROVE' ? 'Approve Quote Request' : 'Reject Quote Request'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Client: <span className="font-semibold text-slate-800">{selectedRequest.quote?.deal?.clientName}</span>{' '}
              • Quote: {formatCurrency(selectedRequest.quote?.finalQuote)}
            </p>

            <form onSubmit={handleDecision} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Manager Decision Note (Optional)
                </label>
                <textarea
                  rows={3}
                  value={decisionReason}
                  onChange={(e) => setDecisionReason(e.target.value)}
                  placeholder={
                    actionType === 'APPROVE'
                      ? 'Approved per management guidelines...'
                      : 'Margin floor is too low, please adjust site days...'
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={approveMutation.isPending || rejectMutation.isPending}
                  className={`px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-md transition-colors ${
                    actionType === 'APPROVE' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
                  }`}
                >
                  {approveMutation.isPending || rejectMutation.isPending
                    ? 'Processing...'
                    : actionType === 'APPROVE'
                    ? 'Confirm Approval'
                    : 'Confirm Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Costing Sheet View Modal */}
      {activeCostingSheet && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <span className="bg-emerald-50 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                  Costing Audit Breakdown
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  {activeCostingSheet.clientName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Service: <span className="font-semibold text-slate-700">{activeCostingSheet.subService}</span>
                  {activeCostingSheet.projectName && ` • Project: ${activeCostingSheet.projectName}`}
                </p>
              </div>
              <button
                onClick={() => setActiveCostingSheet(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg p-1.5 hover:bg-slate-100 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 text-xs">
              {/* Conditional rendering for EMS vs standard sheet */}
              {(() => {
                const isEms = activeCostingSheet.instrumentRows?.isEms || 
                              activeCostingSheet.subService?.toLowerCase().includes('ems') ||
                              activeCostingSheet.serviceCategory?.toLowerCase().includes('iot');

                if (isEms) {
                  const instObj = activeCostingSheet.instrumentRows || {};
                  const hwRows = (instObj.emsHardwareRows || []).filter((r: any) => Number(r.qty || 0) > 0);
                  const mpRows = (activeCostingSheet.manpowerRows || instObj.emsManpowerRows || []).filter((r: any) => 
                    Number(r.siteWorkingDays || 0) > 0 || Number(r.reportWorkingDays || 0) > 0
                  );
                  const pfRows = (instObj.emsPlatformRows || []).filter((r: any) => Number(r.qty || 0) > 0);
                  const rcRows = (instObj.emsRecurringRows || []).filter((r: any) => Number(r.qty || 0) > 0);

                  return (
                    <div className="space-y-6">
                      {/* EMS Hardware */}
                      {hwRows.length > 0 && (
                        <div>
                          <h4 className="font-black text-slate-900 mb-2 border-b border-slate-100 pb-1 text-xs uppercase tracking-wider text-indigo-900">
                            1. Hardware supply
                          </h4>
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                                <th className="p-2 w-10">No</th>
                                <th className="p-2">Description</th>
                                <th className="p-2 text-center w-16">Qty</th>
                                <th className="p-2 text-center w-16">UoM</th>
                                <th className="p-2 text-right w-28">Unit Cost</th>
                                <th className="p-2 text-right w-28">Total Cost</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                              {hwRows.map((r: any, idx: number) => (
                                <tr key={idx} className="hover:bg-slate-50/50">
                                  <td className="p-2 text-slate-400 font-semibold">{r.code || idx + 1}</td>
                                  <td className="p-2 text-slate-800">{r.description}</td>
                                  <td className="p-2 text-center">{r.qty}</td>
                                  <td className="p-2 text-center text-slate-500">{r.uom}</td>
                                  <td className="p-2 text-right">₹{formatCurrency(r.unitCost || 0).replace('₹', '')}</td>
                                  <td className="p-2 text-right font-bold text-slate-700">₹{formatCurrency(Number(r.qty || 0) * Number(r.unitCost || 0)).replace('₹', '')}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* EMS Manpower */}
                      {mpRows.length > 0 && (
                        <div>
                          <h4 className="font-black text-slate-900 mb-2 border-b border-slate-100 pb-1 text-xs uppercase tracking-wider text-purple-900">
                            2. Manpower, site & engineering expenses
                          </h4>
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                                <th className="p-2">Role / Level</th>
                                <th className="p-2 text-center w-24">Site Days</th>
                                <th className="p-2 text-center w-24">Report Days</th>
                                <th className="p-2 text-right w-28">Site Day Rate</th>
                                <th className="p-2 text-right w-28">Total Cost</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                              {mpRows.map((r: any, idx: number) => {
                                const totalCost = (Number(r.siteWorkCost || 0) * Number(r.siteWorkingDays || 0)) + 
                                                  (Number(r.reportWorkCost || 0) * Number(r.reportWorkingDays || 0));
                                return (
                                  <tr key={idx} className="hover:bg-slate-50/50">
                                    <td className="p-2 text-slate-800">{r.roleLevel?.replace('_', ' ') || r.role || 'Engineer'}</td>
                                    <td className="p-2 text-center">{r.siteWorkingDays}</td>
                                    <td className="p-2 text-center text-slate-500">{r.reportWorkingDays}</td>
                                    <td className="p-2 text-right">₹{formatCurrency(r.siteWorkCost || 0).replace('₹', '')}</td>
                                    <td className="p-2 text-right font-bold text-slate-700">₹{formatCurrency(totalCost).replace('₹', '')}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* EMS Platform */}
                      {pfRows.length > 0 && (
                        <div>
                          <h4 className="font-black text-slate-900 mb-2 border-b border-slate-100 pb-1 text-xs uppercase tracking-wider text-sky-900">
                            3. IoT platform setup & cloud configuration
                          </h4>
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                                <th className="p-2">Platform Setup Description</th>
                                <th className="p-2 text-center w-16">Qty</th>
                                <th className="p-2 text-center w-16">UoM</th>
                                <th className="p-2 text-right w-28">Unit Cost</th>
                                <th className="p-2 text-right w-28">Total Cost</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                              {pfRows.map((r: any, idx: number) => (
                                <tr key={idx} className="hover:bg-slate-50/50">
                                  <td className="p-2 text-slate-800">{r.description}</td>
                                  <td className="p-2 text-center">{r.qty}</td>
                                  <td className="p-2 text-center text-slate-500">{r.uom}</td>
                                  <td className="p-2 text-right">₹{formatCurrency(r.unitCost || 0).replace('₹', '')}</td>
                                  <td className="p-2 text-right font-bold text-slate-700">₹{formatCurrency(Number(r.qty || 0) * Number(r.unitCost || 0)).replace('₹', '')}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* EMS Recurring */}
                      {rcRows.length > 0 && (
                        <div>
                          <h4 className="font-black text-slate-900 mb-2 border-b border-slate-100 pb-1 text-xs uppercase tracking-wider text-amber-900">
                            4. Subscription & cloud charges (yearly costing)
                          </h4>
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                                <th className="p-2">Subscription Description</th>
                                <th className="p-2 text-center w-16">Qty</th>
                                <th className="p-2 text-center w-16">UoM</th>
                                <th className="p-2 text-right w-28">Monthly Rate</th>
                                <th className="p-2 text-right w-28">Yearly Total</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                              {rcRows.map((r: any, idx: number) => (
                                <tr key={idx} className="hover:bg-slate-50/50">
                                  <td className="p-2 text-slate-800">{r.description}</td>
                                  <td className="p-2 text-center">{r.qty}</td>
                                  <td className="p-2 text-center text-slate-500">{r.uom}</td>
                                  <td className="p-2 text-right">₹{formatCurrency(r.unitCostPerMonth || 0).replace('₹', '')}</td>
                                  <td className="p-2 text-right font-bold text-slate-700">₹{formatCurrency(Number(r.qty || 0) * Number(r.unitCostPerMonth || 0) * 12).replace('₹', '')}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                } else {
                  // General Audit Sheets
                  const mpRows = (activeCostingSheet.manpowerRows || []).filter((r: any) => 
                    Number(r.siteWorkingDays || 0) > 0 || Number(r.reportWorkingDays || 0) > 0
                  );
                  const instRows = (activeCostingSheet.instrumentRows || []).filter((r: any) => 
                    Number(r.sets || 0) > 0 && Number(r.siteWorkingDays || 0) > 0 && Number(r.rentalCost || 0) > 0
                  );
                  const extraRows = (activeCostingSheet.extraExpenseRows || []).filter((r: any) => 
                    Number(r.qty || 0) > 0 && Number(r.rate || 0) > 0
                  );

                  return (
                    <div className="space-y-6">
                      {/* Manpower */}
                      {mpRows.length > 0 && (
                        <div>
                          <h4 className="font-black text-slate-900 mb-2 border-b border-slate-100 pb-1 text-xs uppercase tracking-wider text-indigo-900">
                            Manpower Resource Allocation
                          </h4>
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                                <th className="p-2">Role Name</th>
                                <th className="p-2 text-center w-24">Site Days</th>
                                <th className="p-2 text-center w-24">Report Days</th>
                                <th className="p-2 text-right w-28">Site Rate</th>
                                <th className="p-2 text-right w-28">Total Cost</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                              {mpRows.map((r: any, idx: number) => {
                                const totalCost = (Number(r.siteWorkCost || 0) * Number(r.siteWorkingDays || 0)) + 
                                                  (Number(r.reportWorkCost || 0) * Number(r.reportWorkingDays || 0));
                                return (
                                  <tr key={idx} className="hover:bg-slate-50/50">
                                    <td className="p-2 text-slate-850 font-semibold">{r.role || r.roleLevel?.replace('_', ' ')}</td>
                                    <td className="p-2 text-center">{r.siteWorkingDays}</td>
                                    <td className="p-2 text-center text-slate-500">{r.reportWorkingDays}</td>
                                    <td className="p-2 text-right">₹{formatCurrency(r.siteWorkCost || 0).replace('₹', '')}</td>
                                    <td className="p-2 text-right font-bold text-slate-700">₹{formatCurrency(totalCost).replace('₹', '')}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Instruments */}
                      {instRows.length > 0 && (
                        <div>
                          <h4 className="font-black text-slate-900 mb-2 border-b border-slate-100 pb-1 text-xs uppercase tracking-wider text-purple-900">
                            Rental Instruments Used
                          </h4>
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                                <th className="p-2">Instrument</th>
                                <th className="p-2 text-center w-20">Sets</th>
                                <th className="p-2 text-center w-24">Site Days</th>
                                <th className="p-2 text-right w-28">Day Rate</th>
                                <th className="p-2 text-right w-28">Total Cost</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                              {instRows.map((r: any, idx: number) => {
                                const totalCost = Number(r.sets || 1) * Number(r.siteWorkingDays || 1) * Number(r.rentalCost || 0);
                                return (
                                  <tr key={idx} className="hover:bg-slate-50/50">
                                    <td className="p-2 text-slate-850">{r.instrumentName}</td>
                                    <td className="p-2 text-center">{r.sets}</td>
                                    <td className="p-2 text-center">{r.siteWorkingDays}</td>
                                    <td className="p-2 text-right">₹{formatCurrency(r.rentalCost || 0).replace('₹', '')}</td>
                                    <td className="p-2 text-right font-bold text-slate-700">₹{formatCurrency(totalCost).replace('₹', '')}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Extra Expenses */}
                      {extraRows.length > 0 && (
                        <div>
                          <h4 className="font-black text-slate-900 mb-2 border-b border-slate-100 pb-1 text-xs uppercase tracking-wider text-amber-900">
                            Extra Logistics & Travel Expenses
                          </h4>
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                                <th className="p-2">Expense / Description</th>
                                <th className="p-2 w-32">Category</th>
                                <th className="p-2 text-center w-20">Qty</th>
                                <th className="p-2 text-center w-20">Days</th>
                                <th className="p-2 text-right w-28">Rate</th>
                                <th className="p-2 text-right w-28">Total Cost</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                              {extraRows.map((r: any, idx: number) => {
                                const totalCost = Number(r.rate || 0) * Number(r.qty || 1) * Number(r.days || 1);
                                return (
                                  <tr key={idx} className="hover:bg-slate-50/50">
                                    <td className="p-2 text-slate-800">{r.description}</td>
                                    <td className="p-2 text-slate-500 font-semibold text-[10px] uppercase tracking-wider">{r.category}</td>
                                    <td className="p-2 text-center">{r.qty}</td>
                                    <td className="p-2 text-center text-slate-500">{r.days}</td>
                                    <td className="p-2 text-right">₹{formatCurrency(r.rate || 0).replace('₹', '')}</td>
                                    <td className="p-2 text-right font-bold text-slate-700">₹{formatCurrency(totalCost).replace('₹', '')}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                }
              })()}
            </div>

            {/* Calculations Summary Info */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold text-slate-700">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-extrabold">Sustainabyte Cost</span>
                <p className="text-base font-black text-slate-900 mt-1">
                  ₹{formatCurrency(activeCostingSheet.subtotalCost)}
                </p>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-extrabold">Margin Percentage</span>
                <p className="text-base font-black text-indigo-700 mt-1">
                  {activeCostingSheet.marginPct}%
                </p>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-extrabold">Buffer / Contingency</span>
                <p className="text-base font-black text-amber-700 mt-1">
                  {activeCostingSheet.bufferPct}%
                </p>
              </div>
              <div>
                <span className="text-emerald-800 block text-[10px] uppercase tracking-wider font-extrabold">Final Quote Price</span>
                <p className="text-lg font-black text-emerald-700 mt-1">
                  {formatCurrency(activeCostingSheet.finalQuote)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end mt-6">
              <button
                type="button"
                onClick={() => setActiveCostingSheet(null)}
                className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Close Sheet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Single Costing Sheet Delete Modal */}
      {sheetToDelete && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-3 text-rose-600 bg-rose-50 p-3.5 rounded-2xl border border-rose-100">
              <AlertTriangle className="h-6 w-6 shrink-0" />
              <div>
                <h4 className="font-extrabold text-sm text-rose-900">Delete Costing Sheet</h4>
                <p className="text-[11px] text-rose-700">This action will remove this sheet from database costing records.</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Client Name:</span>
                <span className="font-bold text-slate-900">{sheetToDelete.clientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Offering / Sub-Service:</span>
                <span className="font-bold text-indigo-700">{sheetToDelete.subService || 'Offering'}</span>
              </div>
              {sheetToDelete.projectName && (
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Project Name:</span>
                  <span className="font-semibold text-slate-800">{sheetToDelete.projectName}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Final Quote Value:</span>
                <span className="font-extrabold text-emerald-600">
                  {formatCurrency(sheetToDelete.finalQuote)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Saved Date:</span>
                <span className="text-slate-600">{formatDate(sheetToDelete.createdAt)}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSheetToDelete(null)}
                disabled={deleteSheetMutation.isPending}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteSheetMutation.mutate(sheetToDelete)}
                disabled={deleteSheetMutation.isPending}
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {deleteSheetMutation.isPending ? 'Deleting...' : 'Yes, Delete Sheet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk / Mapping Delete Confirmation Modal */}
      {isBulkDeleting && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-3 text-rose-600 bg-rose-50 p-3.5 rounded-2xl border border-rose-100">
              <AlertTriangle className="h-6 w-6 shrink-0" />
              <div>
                <h4 className="font-extrabold text-sm text-rose-900">Delete Mapping Costing Sheets</h4>
                <p className="text-[11px] text-rose-700">Delete all sheets matching active client / service filter.</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Matched Sheets Count:</span>
                <span className="font-extrabold text-rose-600 text-sm">{filteredSavedSheets.length} sheet(s)</span>
              </div>
              {clientFilter && (
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Filter Client:</span>
                  <span className="font-bold text-slate-900">{clientFilter}</span>
                </div>
              )}
              {serviceFilter && (
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Filter Service:</span>
                  <span className="font-bold text-indigo-700">{serviceFilter}</span>
                </div>
              )}
              {searchQuery && (
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Search Query:</span>
                  <span className="font-semibold text-slate-800">"{searchQuery}"</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsBulkDeleting(false)}
                disabled={deleteMappingMutation.isPending}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteMappingMutation.mutate()}
                disabled={deleteMappingMutation.isPending}
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {deleteMappingMutation.isPending ? 'Deleting...' : `Delete All ${filteredSavedSheets.length} Sheets`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
