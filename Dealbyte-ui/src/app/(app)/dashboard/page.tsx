'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  TrendingUp,
  DollarSign,
  AlertTriangle,
  FileSpreadsheet,
  RefreshCw,
  Plus,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { dashboardApi } from '@/lib/api/dashboard';
import MetricCard from '@/components/dashboard/MetricCard';
import FunnelChart from '@/components/dashboard/FunnelChart';
import MarginByServiceChart from '@/components/dashboard/MarginByServiceChart';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function DashboardPage() {
  const {
    data: overview,
    isLoading: isLoadingOverview,
    error: errorOverview,
    refetch: refetchOverview,
  } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: dashboardApi.getOverview,
    refetchInterval: 30000,
  });

  const {
    data: marginData,
    isLoading: isLoadingMargin,
    error: errorMargin,
    refetch: refetchMargin,
  } = useQuery({
    queryKey: ['dashboard-costing-margin'],
    queryFn: dashboardApi.getCostingMargin,
    refetchInterval: 30000,
  });

  const isLoading = isLoadingOverview || isLoadingMargin;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-slate-200 rounded-lg"></div>
          <div className="h-10 w-32 bg-slate-200 rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white border border-slate-200 rounded-2xl p-6"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-white border border-slate-200 rounded-2xl p-6"></div>
          <div className="h-80 bg-white border border-slate-200 rounded-2xl p-6"></div>
        </div>
      </div>
    );
  }

  if (errorOverview || errorMargin) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center max-w-lg mx-auto my-12">
        <AlertTriangle className="h-12 w-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-rose-900">Failed to load dashboard data</h3>
        <p className="text-xs text-rose-600 mt-1">Please check server connection or backend status.</p>
        <button
          onClick={() => {
            refetchOverview();
            refetchMargin();
          }}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs rounded-lg transition-colors"
        >
          <RefreshCw className="h-4 w-4" /> Retry Loading
        </button>
      </div>
    );
  }

  const activeVal = overview?.activePipeline?.totalValue || 0;
  const activeCount = overview?.activePipeline?.count || 0;
  const wonCount = overview?.dealsWonThisMonth || 0;
  const lowMarginCount = marginData?.lowMarginQuotes?.length || 0;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Live deal pipeline, margins, and proposal performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              refetchOverview();
              refetchMargin();
            }}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 transition-colors shadow-xs"
            title="Refresh Data"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <Link
            href="/quotes/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-600/20 transition-all"
          >
            <Plus className="h-4 w-4" /> Create Quote
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Active Pipeline Value"
          value={formatCurrency(activeVal)}
          subtitle={`${activeCount} active deals in progress`}
          icon={DollarSign}
          color="indigo"
        />
        <MetricCard
          title="Deals Won This Month"
          value={wonCount}
          subtitle="Closed successfully"
          icon={TrendingUp}
          color="emerald"
        />
        <MetricCard
          title="Low Margin Alerts"
          value={lowMarginCount}
          subtitle={`Below ${marginData?.threshold || 25}% margin threshold`}
          icon={AlertTriangle}
          color={lowMarginCount > 0 ? 'rose' : 'emerald'}
        />
        <MetricCard
          title="Recent Deals"
          value={overview?.recentDeals?.length || 0}
          subtitle="Total enquiries registered"
          icon={FileSpreadsheet}
          color="cyan"
        />
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deal Funnel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Sales Pipeline Funnel</h3>
              <p className="text-xs text-slate-500 mt-0.5">Distribution of deals across stages</p>
            </div>
          </div>
          <FunnelChart stages={overview?.funnel || []} />
        </div>

        {/* Avg Margin by Service */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Average Margin % by Service</h3>
              <p className="text-xs text-slate-500 mt-0.5">Flagged red if below floor threshold ({marginData?.threshold || 25}%)</p>
            </div>
          </div>
          <MarginByServiceChart data={marginData?.marginByService || []} threshold={marginData?.threshold || 25} />
        </div>
      </div>

      {/* Low Margin Quotes Warning Table */}
      {marginData?.lowMarginQuotes && marginData.lowMarginQuotes.length > 0 && (
        <div className="bg-white rounded-2xl border border-rose-200 overflow-hidden shadow-xs">
          <div className="bg-rose-50/70 p-4 px-6 border-b border-rose-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-900">
              <AlertTriangle className="h-5 w-5 text-rose-600" />
              <h3 className="font-bold text-sm">Low-Margin Quotes Requiring Review</h3>
            </div>
            <span className="text-xs font-semibold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full">
              {marginData.lowMarginQuotes.length} Quotes Flagged
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">Client / Service</th>
                  <th className="py-3 px-6">Created By</th>
                  <th className="py-3 px-6">Margin %</th>
                  <th className="py-3 px-6">Final Quote Value</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {marginData.lowMarginQuotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-rose-50/30 transition-colors">
                    <td className="py-3.5 px-6 font-medium text-slate-900">
                      <div>{quote.deal?.clientName || 'Client'}</div>
                      <div className="text-[11px] text-slate-500">
                        {quote.deal?.service?.name?.toLowerCase().includes('digiweld') || quote.deal?.service?.name?.toLowerCase().includes('weld data')
                          ? 'Digiweld'
                          : quote.deal?.service?.name || 'Standard Service'}
                      </div>
                    </td>
                    <td className="py-3.5 px-6">{quote.createdBy?.name || 'User'}</td>
                    <td className="py-3.5 px-6 font-bold text-rose-600">{quote.marginPct}%</td>
                    <td className="py-3.5 px-6 font-semibold">{formatCurrency(quote.finalQuote)}</td>
                    <td className="py-3.5 px-6 text-right">
                      <Link
                        href={`/quotes/${quote.id}`}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1"
                      >
                        View Quote <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
