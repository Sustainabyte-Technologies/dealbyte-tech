'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FileText,
  ArrowRight,
  Clock,
  CheckCircle2,
  Plus,
  Search,
  Eye,
  Send,
  FileCheck,
  Edit,
  X,
  Building,
  Hash,
  Tag,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { proposalsApi, Proposal, ProposalStatus } from '@/lib/api/proposals';
import { formatCurrency, formatDate } from '@/lib/utils';
import FullPageWatermark from '@/components/common/FullPageWatermark';

export default function ProposalsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Edit Modal State
  const [editingProposal, setEditingProposal] = useState<Proposal | null>(null);
  const [editClientName, setEditClientName] = useState('');
  const [editProposalNumber, setEditProposalNumber] = useState('');
  const [editStatus, setEditStatus] = useState<ProposalStatus>('DRAFT');

  const { data: proposals = [], isLoading } = useQuery({
    queryKey: ['proposals'],
    queryFn: proposalsApi.getAll,
  });

  const handleOpenEditModal = (p: Proposal) => {
    setEditingProposal(p);
    setEditClientName(p.deal?.clientName || '');
    setEditProposalNumber(p.proposalNumber || `STPL-${p.id.substring(0, 4).toUpperCase()}`);
    setEditStatus(p.status);
  };

  const updateProposalMutation = useMutation({
    mutationFn: async () => {
      if (!editingProposal) return;
      return proposalsApi.update(editingProposal.id, {
        clientName: editClientName,
        proposalNumber: editProposalNumber,
        status: editStatus,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
      queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
      toast.success('Proposal updated & saved to Database!');
      setEditingProposal(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update proposal');
    },
  });

  // Calculate metrics
  const totalCount = proposals.length;
  const draftCount = proposals.filter((p) => p.status === 'DRAFT').length;
  const reviewedCount = proposals.filter((p) => p.status === 'REVIEWED').length;
  const sentCount = proposals.filter((p) => p.status === 'SENT').length;

  // Filter proposals
  const filteredProposals = proposals.filter((p) => {
    const matchesStatus = selectedStatus === 'ALL' || p.status === selectedStatus;
    const client = p.deal?.clientName?.toLowerCase() || '';
    const service = p.deal?.service?.name?.toLowerCase() || '';
    const owner = p.deal?.owner?.name?.toLowerCase() || '';
    const query = searchTerm.toLowerCase();

    const matchesSearch =
      client.includes(query) || service.includes(query) || owner.includes(query);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="relative space-y-8 max-w-7xl mx-auto p-2 min-h-screen">
      {/* Full Page Branded Background Watermark */}
      <FullPageWatermark opacity={0.08} size="750px" />

      <div className="relative z-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="h-6 w-6 text-indigo-600" /> Costing &amp; Proposal Automation
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor generated proposals, edit proposal records, document statuses, and dispatch to clients
          </p>
        </div>

        <Link
          href="/quotes/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#3BD98E] hover:bg-[#3BD98E]/90 text-[#0D1B3C] font-bold text-xs rounded-xl shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Create Quote
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Proposals</span>
            <FileText className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{totalCount}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Draft</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-amber-600 mt-2">{draftCount}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Reviewed</span>
            <FileCheck className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-extrabold text-indigo-600 mt-2">{reviewedCount}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Sent to Client</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-600 mt-2">{sentCount}</p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by client, service, owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'DRAFT', 'REVIEWED', 'SENT'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                selectedStatus === status
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status === 'ALL' ? 'All Proposals' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Proposals Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">Loading proposals...</div>
        ) : filteredProposals.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <FileText className="h-10 w-10 mx-auto text-slate-300" />
            <p className="text-sm font-medium">
              {proposals.length === 0
                ? 'No proposals generated yet.'
                : 'No proposals match your filter criteria.'}
            </p>
            <Link
              href="/quotes/new"
              className="inline-block text-xs text-indigo-600 hover:underline font-semibold"
            >
              Create a Quote to Generate Proposal
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Proposal Ref</th>
                  <th className="py-3.5 px-6">Client / Service</th>
                  <th className="py-3.5 px-6">Owner</th>
                  <th className="py-3.5 px-6">Quote Value</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Generated Date</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProposals.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-indigo-600 text-xs">
                      {p.proposalNumber || `STPL-${p.id.substring(0, 4).toUpperCase()}`}
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-900">
                      <div>{p.deal?.clientName || 'Client'}</div>
                      <div className="text-xs text-slate-500 font-normal">
                        {p.deal?.service?.name || 'Standard Service'}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-700">
                      {p.deal?.owner?.name || 'Sales Executive'}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {formatCurrency(p.quote?.finalQuote)}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          p.status === 'SENT'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : p.status === 'REVIEWED'
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {p.status === 'SENT' && <CheckCircle2 className="h-3 w-3" />}
                        {p.status === 'REVIEWED' && <FileCheck className="h-3 w-3" />}
                        {p.status === 'DRAFT' && <Clock className="h-3 w-3 text-slate-400" />}
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500">
                      {formatDate(p.generatedAt)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/quotes/new?editQuoteId=${p.quoteId || p.quote?.id}`}
                          className="text-xs text-amber-700 hover:text-amber-900 font-semibold inline-flex items-center gap-1 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 transition-colors"
                        >
                          <Edit className="h-3.5 w-3.5" /> Edit
                        </Link>
                        <Link
                          href={`/proposals/${p.id}`}
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          View &amp; Send <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Proposal Modal */}
      {editingProposal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-base">Edit Proposal Record</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingProposal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Client Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Building className="h-3.5 w-3.5 text-slate-400" /> Client Name
                </label>
                <input
                  type="text"
                  value={editClientName}
                  onChange={(e) => setEditClientName(e.target.value)}
                  placeholder="Enter Client Name"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Proposal Ref Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Hash className="h-3.5 w-3.5 text-slate-400" /> Proposal Reference Number
                </label>
                <input
                  type="text"
                  value={editProposalNumber}
                  onChange={(e) => setEditProposalNumber(e.target.value)}
                  placeholder="e.g. STPL-001"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Tag className="h-3.5 w-3.5 text-slate-400" /> Proposal Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as ProposalStatus)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="REVIEWED">REVIEWED</option>
                  <option value="SENT">SENT</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingProposal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => updateProposalMutation.mutate()}
                disabled={updateProposalMutation.isPending}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {updateProposalMutation.isPending ? 'Saving...' : 'Save Proposal Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
