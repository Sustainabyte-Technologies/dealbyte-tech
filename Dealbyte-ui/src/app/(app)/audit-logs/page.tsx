'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  History,
  Search,
  User as UserIcon,
  Mail,
  Filter,
  Calendar,
  Clock,
  FileText,
  Briefcase,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { auditLogsApi, AuditLogItem } from '@/lib/api/auditLogs';

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [selectedEntityType, setSelectedEntityType] = useState<string>('');

  // Fetch Audit Logs
  const { data: logs = [], isLoading, refetch } = useQuery({
    queryKey: ['audit-logs', searchQuery, selectedAction, selectedEntityType],
    queryFn: () =>
      auditLogsApi.getAll({
        search: searchQuery || undefined,
        action: selectedAction || undefined,
        entityType: selectedEntityType || undefined,
      }),
  });

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return dateStr;
    }
  };

  const getActionTag = (action: string) => {
    const act = action.toUpperCase();
    if (act === 'CREATE') {
      return (
        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-200 uppercase shrink-0">
          + ADD
        </span>
      );
    }
    if (act === 'UPDATE') {
      return (
        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px] border border-amber-200 uppercase shrink-0">
          ✏️ EDIT
        </span>
      );
    }
    if (act === 'DELETE') {
      return (
        <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold text-[10px] border border-rose-200 uppercase shrink-0">
          🗑️ DELETE
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold text-[10px] border border-slate-200 uppercase shrink-0">
        {action}
      </span>
    );
  };

  const getWorkedDetails = (log: AuditLogItem) => {
    const { action, entityType, entityId, details } = log;

    if (details?.description) {
      return details.description;
    }

    if (details?.proposalNumber || entityType === 'Quote' || entityType === 'Proposal') {
      const pNum = details?.proposalNumber || entityId;
      const client = details?.clientName ? ` for "${details.clientName}"` : '';
      const amount = details?.finalQuote ? ` (Total: ₹${Number(details.finalQuote).toLocaleString('en-IN')})` : '';

      if (action === 'CREATE') return `Created Commercial Proposal ${pNum}${client}${amount}`;
      if (action === 'UPDATE') return `Edited Commercial Proposal ${pNum}${client}`;
      if (action === 'DELETE') return `Deleted Commercial Proposal ${pNum}${client}`;
    }

    if (entityType === 'Client') {
      const name = details?.newName || details?.clientName || entityId;
      if (action === 'CREATE') return `Added new Client "${name}" to Database`;
      if (action === 'UPDATE') return `Updated Client details for "${name}"`;
      if (action === 'DELETE') return `Deleted Client "${name}"`;
    }

    if (entityType === 'RateCard') {
      const role = details?.roleName || entityId;
      if (action === 'CREATE') return `Added Rate Card entry for "${role}"`;
      if (action === 'UPDATE') return `Updated Rate Card rates for "${role}"`;
      if (action === 'DELETE') return `Removed Rate Card entry for "${role}"`;
    }

    if (action === 'CREATE') return `Created new ${entityType} record (${entityId})`;
    if (action === 'UPDATE') return `Updated ${entityType} record (${entityId})`;
    if (action === 'DELETE') return `Deleted ${entityType} record (${entityId})`;

    return `Worked on ${entityType} (${entityId})`;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center font-bold shadow-xs shrink-0">
            <History className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Audit Logs & User Operations
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              History of user actions, timestamps, and detailed work changes across all proposals, quotes &amp; clients
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Clock className="h-3.5 w-3.5 text-slate-500" /> Refresh History
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search user name, email, or worked details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Action Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400 shrink-0" />
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Operations (+ Add, Edit, Delete)</option>
              <option value="CREATE">CREATE / ADD</option>
              <option value="UPDATE">UPDATE / EDIT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>

          {/* Entity Type Filter */}
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-slate-400 shrink-0" />
            <select
              value={selectedEntityType}
              onChange={(e) => setSelectedEntityType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Target Types (Proposals, Clients, etc.)</option>
              <option value="Client">Client</option>
              <option value="Quote">Quote</option>
              <option value="Proposal">Proposal</option>
              <option value="RateCard">Rate Card</option>
              <option value="Service">Service</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Logs Table Card (Clean 3-Column Layout) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <div className="animate-spin h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto" />
            <p className="text-xs font-semibold">Loading Audit Log records...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <History className="h-8 w-8 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-800">No Audit Logs Found</p>
            <p className="text-xs text-slate-500">
              Try modifying your search query or clear action/entity filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-6 w-56">Timestamp</th>
                  <th className="py-3.5 px-6 w-72">User Details (Name &amp; Email)</th>
                  <th className="py-3.5 px-6">Worked Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Timestamp */}
                    <td className="py-4 px-6 font-mono text-slate-600 whitespace-nowrap align-top">
                      <div className="flex items-center gap-1.5 font-semibold">
                        <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{formatDate(log.timestamp)}</span>
                      </div>
                    </td>

                    {/* User Name & Email */}
                    <td className="py-4 px-6 align-top">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {log.user?.name ? log.user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <UserIcon className="h-3 w-3 text-slate-400" />
                            <span>{log.user?.name || 'System / Anonymous'}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Mail className="h-3 w-3 text-indigo-500" />
                            <span className="font-mono">{log.user?.email || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Worked Details Column */}
                    <td className="py-4 px-6 align-top">
                      <div className="flex items-start gap-2.5">
                        {getActionTag(log.action)}
                        <p className="font-semibold text-slate-900 text-xs leading-snug pt-0.5">
                          {getWorkedDetails(log)}
                        </p>
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
  );
}
