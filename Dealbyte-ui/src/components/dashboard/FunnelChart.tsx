'use client';

import React, { useState } from 'react';
import {
  Maximize2,
  X,
  Download,
  Filter,
  TrendingUp,
  Layers,
  Table as TableIcon,
  BarChart2,
} from 'lucide-react';
import { FunnelStage } from '@/lib/api/dashboard';
import { formatCurrency } from '@/lib/utils';

interface FunnelChartProps {
  stages: FunnelStage[];
}

const STAGE_CONFIG: Record<
  string,
  { label: string; bgGradient: string; badgeBg: string; textColor: string; barColor: string }
> = {
  ENQUIRY: {
    label: 'Enquiry',
    bgGradient: 'from-sky-500 to-sky-600',
    badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
    textColor: 'text-sky-600',
    barColor: '#0ea5e9',
  },
  QUOTED: {
    label: 'Quoted',
    bgGradient: 'from-indigo-500 to-indigo-600',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    textColor: 'text-indigo-600',
    barColor: '#6366f1',
  },
  NEGOTIATION: {
    label: 'Negotiation',
    bgGradient: 'from-amber-500 to-amber-600',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    textColor: 'text-amber-600',
    barColor: '#f59e0b',
  },
  WON: {
    label: 'Won',
    bgGradient: 'from-emerald-500 to-emerald-600',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    textColor: 'text-emerald-600',
    barColor: '#10b981',
  },
  LOST: {
    label: 'Lost',
    bgGradient: 'from-rose-500 to-rose-600',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    textColor: 'text-rose-600',
    barColor: '#f43f5e',
  },
};

export default function FunnelChart({ stages }: FunnelChartProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<'visual' | 'table'>('visual');

  const stageMap = new Map(stages.map((s) => [s.stage, s]));
  const orderedStages = ['ENQUIRY', 'QUOTED', 'NEGOTIATION', 'WON', 'LOST'];

  const totalCount = stages.reduce((acc, s) => acc + s._count, 0);
  const totalValue = stages.reduce((acc, s) => acc + (s._sum?.value || 0), 0);
  const wonStage = stageMap.get('WON');
  const winRatePct = totalCount > 0 ? Math.round(((wonStage?._count || 0) / totalCount) * 100) : 0;

  const exportCSV = () => {
    const headers = ['Stage Name', 'Deal Count', 'Percentage %', 'Total Stage Value'];
    const rows = orderedStages.map((key) => {
      const item = stageMap.get(key as any) || { _count: 0, _sum: { value: 0 } };
      const cfg = STAGE_CONFIG[key];
      const pct = totalCount > 0 ? Math.round((item._count / totalCount) * 100) : 0;
      return [cfg.label, item._count, `${pct}%`, item._sum?.value || 0];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sales_pipeline_funnel_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Header controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span>{totalCount} Total Pipeline Deals</span>
          <span>•</span>
          <span className="text-slate-900 font-bold">{formatCurrency(totalValue)}</span>
        </div>

        <button
          onClick={() => setIsExpanded(true)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2.5 py-1.5 rounded-lg transition-colors border border-indigo-100 shadow-2xs"
          title="Expand Funnel View"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          <span>Expand</span>
        </button>
      </div>

      {/* Main Funnel Rendering */}
      <div className="space-y-3.5">
        {orderedStages.map((stageKey) => {
          const item = stageMap.get(stageKey as any) || { _count: 0, _sum: { value: 0 } };
          const cfg = STAGE_CONFIG[stageKey];
          const pct = totalCount > 0 ? Math.round((item._count / totalCount) * 100) : 0;
          const val = item._sum?.value || 0;

          return (
            <div key={stageKey} className="group space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800">{cfg.label}</span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${cfg.badgeBg}`}
                  >
                    {pct}% of pipeline
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <span className="font-semibold text-slate-700">{item._count} deals</span>
                  <span className="font-bold text-slate-900">{formatCurrency(val)}</span>
                </div>
              </div>

              {/* Progress track */}
              <div className="h-3.5 w-full bg-slate-100 rounded-full p-0.5 shadow-inner flex overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${cfg.bgGradient} transition-all duration-500 rounded-full shadow-sm`}
                  style={{ width: `${Math.max(pct, item._count > 0 ? 4 : 0)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* FULLSCREEN EXPAND MODAL */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 md:p-8 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl h-[85vh] max-h-[750px] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 flex-shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                    Sales Pipeline Funnel
                  </h2>
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-100">
                    Win Rate: {winRatePct}%
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Comprehensive deal distribution and conversion performance metrics
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* View switcher */}
                <div className="bg-slate-200/70 p-1 rounded-xl flex items-center gap-1 text-xs font-semibold">
                  <button
                    onClick={() => setViewMode('visual')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                      viewMode === 'visual'
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <BarChart2 className="h-3.5 w-3.5" /> Funnel View
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                      viewMode === 'table'
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <TableIcon className="h-3.5 w-3.5" /> Breakdown
                  </button>
                </div>

                <button
                  onClick={exportCSV}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors shadow-2xs"
                  title="Export to CSV"
                >
                  <Download className="h-3.5 w-3.5 text-slate-500" /> Export CSV
                </button>

                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
                  title="Close Modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal KPI highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 px-6 bg-slate-50/30 border-b border-slate-100 flex-shrink-0">
              <div className="bg-white p-3 px-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <p className="text-[11px] font-medium text-slate-500">Total Active Pipeline</p>
                <p className="text-xl font-extrabold text-slate-900 mt-0.5">
                  {formatCurrency(totalValue)}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">{totalCount} Deals Registered</p>
              </div>

              <div className="bg-white p-3 px-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <p className="text-[11px] font-medium text-slate-500">Deals Closed Won</p>
                <p className="text-xl font-extrabold text-emerald-600 mt-0.5">
                  {wonStage?._count || 0} Deals
                </p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                  {formatCurrency(wonStage?._sum?.value || 0)} Total Revenue
                </p>
              </div>

              <div className="bg-white p-3 px-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <p className="text-[11px] font-medium text-slate-500">Pipeline Win Ratio</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xl font-extrabold text-indigo-600">{winRatePct}%</span>
                  <span className="text-xs text-slate-500 font-medium">Conversion</span>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {viewMode === 'visual' ? (
                <div className="space-y-4 max-w-3xl mx-auto py-2">
                  {orderedStages.map((stageKey) => {
                    const item = stageMap.get(stageKey as any) || { _count: 0, _sum: { value: 0 } };
                    const cfg = STAGE_CONFIG[stageKey];
                    const pct = totalCount > 0 ? Math.round((item._count / totalCount) * 100) : 0;
                    const val = item._sum?.value || 0;

                    return (
                      <div key={stageKey} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-slate-900">{cfg.label}</span>
                            <span
                              className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${cfg.badgeBg}`}
                            >
                              {pct}% of pipeline
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-slate-600">
                            <span className="font-semibold text-slate-700">{item._count} Deals</span>
                            <span className="font-bold text-slate-900">
                              {formatCurrency(val)}
                            </span>
                          </div>
                        </div>

                        {/* Thick gradient progress bar */}
                        <div className="h-5 w-full bg-slate-100 rounded-2xl p-1 shadow-inner flex overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${cfg.bgGradient} transition-all duration-500 rounded-xl flex items-center justify-end pr-3 shadow-sm`}
                            style={{ width: `${Math.max(pct, item._count > 0 ? 6 : 0)}%` }}
                          >
                            {pct >= 10 && (
                              <span className="text-[10px] font-bold text-white shadow-xs">
                                {pct}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Table Breakdown View */
                <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-3.5 px-6">Pipeline Stage</th>
                        <th className="py-3.5 px-6">Deal Count</th>
                        <th className="py-3.5 px-6">% Share of Deals</th>
                        <th className="py-3.5 px-6">Stage Financial Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                      {orderedStages.map((stageKey) => {
                        const item = stageMap.get(stageKey as any) || { _count: 0, _sum: { value: 0 } };
                        const cfg = STAGE_CONFIG[stageKey];
                        const pct = totalCount > 0 ? Math.round((item._count / totalCount) * 100) : 0;
                        const val = item._sum?.value || 0;

                        return (
                          <tr key={stageKey} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3.5 px-6 font-bold text-slate-900 flex items-center gap-2">
                              <span
                                className={`w-3 h-3 rounded-full bg-gradient-to-r ${cfg.bgGradient}`}
                              ></span>
                              {cfg.label}
                            </td>
                            <td className="py-3.5 px-6 font-semibold">{item._count} deals</td>
                            <td className="py-3.5 px-6 font-bold text-indigo-600">{pct}%</td>
                            <td className="py-3.5 px-6 font-bold text-slate-900">
                              {formatCurrency(val)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 px-6 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs text-slate-500">
              <span>{orderedStages.length} Pipeline Stages</span>
              <button
                onClick={() => setIsExpanded(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

