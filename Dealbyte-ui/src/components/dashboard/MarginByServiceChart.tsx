'use client';

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  CartesianGrid,
  LabelList,
} from 'recharts';
import {
  Maximize2,
  Minimize2,
  X,
  Download,
  BarChart3,
  Table as TableIcon,
  AlertTriangle,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { MarginByService } from '@/lib/api/dashboard';
import { formatCurrency } from '@/lib/utils';

interface MarginByServiceChartProps {
  data: MarginByService[];
  threshold?: number;
}

export default function MarginByServiceChart({ data, threshold = 25 }: MarginByServiceChartProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const [sortBy, setSortBy] = useState<'default' | 'margin-asc' | 'margin-desc' | 'count'>('default');

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-xl p-6">
        <Info className="h-8 w-8 text-slate-300 mb-2" />
        <p className="font-medium text-slate-600">No margin data available yet</p>
        <p className="text-xs text-slate-400 mt-1">Create quotes to see margin analytics by service.</p>
      </div>
    );
  }

  // Base Data preparation
  const rawChartData = data.map((item) => ({
    name: item.serviceName.length > 18 ? `${item.serviceName.substring(0, 16)}...` : item.serviceName,
    fullName: item.serviceName,
    margin: Number(item.avgMarginPct || 0),
    count: item.quoteCount,
    totalValue: item.totalValue || 0,
  }));

  // Apply sorting for expanded view if set
  let processedData = [...rawChartData];
  if (sortBy === 'margin-asc') {
    processedData.sort((a, b) => a.margin - b.margin);
  } else if (sortBy === 'margin-desc') {
    processedData.sort((a, b) => b.margin - a.margin);
  } else if (sortBy === 'count') {
    processedData.sort((a, b) => b.count - a.count);
  }

  // Analytics callouts
  const totalServices = data.length;
  const belowThresholdCount = data.filter((d) => Number(d.avgMarginPct || 0) < threshold).length;
  const avgOverallMargin = Math.round(
    data.reduce((acc, curr) => acc + Number(curr.avgMarginPct || 0), 0) / (totalServices || 1)
  );

  const exportCSV = () => {
    const headers = ['Service Name', 'Average Margin %', 'Quote Count', 'Status'];
    const rows = processedData.map((d) => [
      `"${d.fullName.replace(/"/g, '""')}"`,
      d.margin,
      d.count,
      d.margin < threshold ? 'BELOW FLOOR' : 'HEALTHY',
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `margin_by_service_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderChartBody = (expanded: boolean) => (
    <div className={expanded ? 'flex-1 min-h-0 w-full h-full min-h-[320px]' : 'h-72 w-full'}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={processedData}
          margin={{
            top: 25,
            right: 30,
            left: 5,
            bottom: expanded ? 50 : 45,
          }}
        >
          <defs>
            <linearGradient id="healthyBarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
              <stop offset="100%" stopColor="#4338ca" stopOpacity={0.88} />
            </linearGradient>
            <linearGradient id="warningBarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity={1} />
              <stop offset="100%" stopColor="#be123c" stopOpacity={0.88} />
            </linearGradient>
            <filter id="barShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.15" />
            </filter>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.7} />

          <XAxis
            dataKey={expanded ? 'fullName' : 'name'}
            tick={{ fill: '#475569', fontSize: expanded ? 12 : 11, fontWeight: 500 }}
            angle={-15}
            textAnchor="end"
            interval={0}
            height={expanded ? 50 : 45}
            stroke="#cbd5e1"
          />

          <YAxis
            tick={{ fill: '#64748b', fontSize: 11 }}
            unit="%"
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            stroke="#cbd5e1"
          />

          <Tooltip
            cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const d = payload[0].payload;
                const isLow = d.margin < threshold;
                return (
                  <div className="bg-slate-900/95 text-white p-3.5 rounded-xl text-xs shadow-2xl border border-slate-800 backdrop-blur-md min-w-[210px]">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                      <p className="font-bold text-slate-100 text-xs tracking-tight">{d.fullName}</p>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isLow
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {isLow ? 'Below Floor' : 'Healthy'}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-slate-300">
                        <span>Avg Margin:</span>
                        <span className={`font-bold text-sm ${isLow ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {d.margin}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-slate-400">
                        <span>Total Quotes:</span>
                        <span className="font-semibold text-slate-200">{d.count}</span>
                      </div>
                      {d.totalValue > 0 && (
                        <div className="flex justify-between items-center text-slate-400">
                          <span>Est. Pipeline:</span>
                          <span className="font-semibold text-slate-200">{formatCurrency(d.totalValue)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />

          <ReferenceLine
            y={threshold}
            stroke="#f43f5e"
            strokeDasharray="4 4"
            strokeWidth={2}
            label={({ viewBox }) => {
              if (!viewBox) return null;
              const { x, y } = viewBox;
              return (
                <g transform={`translate(${x + 8}, ${y - 11})`}>
                  <rect x="0" y="0" width="112" height="18" rx="4" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1" />
                  <text x="6" y="13" fill="#dc2626" fontSize="10" fontWeight="700">
                    Floor Threshold ({threshold}%)
                  </text>
                </g>
              );
            }}
          />

          <Bar dataKey="margin" radius={[8, 8, 0, 0]} maxBarSize={expanded ? 60 : 45}>
            {processedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.margin < threshold ? 'url(#warningBarGradient)' : 'url(#healthyBarGradient)'}
                style={{ filter: 'url(#barShadow)' }}
              />
            ))}
            <LabelList
              dataKey="margin"
              position="top"
              formatter={(val: any) => `${val}%`}
              style={{ fill: '#334155', fontSize: 11, fontWeight: 700 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="space-y-3">
      {/* Chart Header Tools */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-xs"></span>
            <span>Healthy (≥{threshold}%)</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-gradient-to-br from-rose-500 to-rose-700 shadow-xs"></span>
            <span>Below Floor (&lt;{threshold}%)</span>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(true)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2.5 py-1.5 rounded-lg transition-colors border border-indigo-100 shadow-2xs"
          title="Expand Graph View"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          <span>Expand</span>
        </button>
      </div>

      {/* Main Bar Chart Rendering */}
      {renderChartBody(false)}

      {/* FULLSCREEN EXPAND MODAL */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 md:p-8 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl h-[88vh] max-h-[780px] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 flex-shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                    Average Margin % by Service
                  </h2>
                  <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-indigo-100">
                    Floor: {threshold}%
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  High-definition analytics & threshold evaluation across service categories
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* View Switcher */}
                <div className="bg-slate-200/70 p-1 rounded-xl flex items-center gap-1 text-xs font-semibold">
                  <button
                    onClick={() => setViewMode('chart')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                      viewMode === 'chart'
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <BarChart3 className="h-3.5 w-3.5" /> Chart
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                      viewMode === 'table'
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <TableIcon className="h-3.5 w-3.5" /> Data Table
                  </button>
                </div>

                {/* Export Button */}
                <button
                  onClick={exportCSV}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors shadow-2xs"
                  title="Export to CSV"
                >
                  <Download className="h-3.5 w-3.5 text-slate-500" /> Export CSV
                </button>

                {/* Close Button */}
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
                  title="Close Modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal KPI Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 px-6 bg-slate-50/30 border-b border-slate-100 flex-shrink-0">
              <div className="bg-white p-3 px-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <p className="text-[11px] font-medium text-slate-500">Overall Average Margin</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xl font-extrabold text-slate-900">{avgOverallMargin}%</span>
                  <span
                    className={`text-xs font-semibold ${
                      avgOverallMargin >= threshold ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    Target: ≥{threshold}%
                  </span>
                </div>
              </div>

              <div className="bg-white p-3 px-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <p className="text-[11px] font-medium text-slate-500">Flagged Services Below Floor</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xl font-extrabold text-rose-600">{belowThresholdCount}</span>
                  {belowThresholdCount > 0 ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                      <AlertTriangle className="h-3 w-3" /> Requires Review
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      <CheckCircle2 className="h-3 w-3" /> All Compliant
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-white p-3 px-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <p className="text-[11px] font-medium text-slate-500">Services Tracked</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xl font-extrabold text-slate-900">{totalServices}</span>
                  <span className="text-xs text-slate-500 font-medium">Service Categories</span>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className={`p-6 flex-1 min-h-0 flex flex-col ${viewMode === 'table' ? 'overflow-y-auto' : 'overflow-hidden'}`}>
              {viewMode === 'chart' ? (
                <div className="flex-1 min-h-0 flex flex-col space-y-2">
                  {/* Sorting controls */}
                  <div className="flex items-center justify-end gap-2 text-xs flex-shrink-0">
                    <span className="text-slate-500 font-medium">Sort graph:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="default">Default</option>
                      <option value="margin-desc">Highest Margin First</option>
                      <option value="margin-asc">Lowest Margin First</option>
                      <option value="count">Most Quotes First</option>
                    </select>
                  </div>

                  {renderChartBody(true)}
                </div>
              ) : (
                /* Table View */
                <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-3.5 px-6">Service Name</th>
                        <th className="py-3.5 px-6">Quote Count</th>
                        <th className="py-3.5 px-6">Average Margin %</th>
                        <th className="py-3.5 px-6">Status</th>
                        <th className="py-3.5 px-6 text-right">Variance vs Floor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                      {processedData.map((item, idx) => {
                        const isLow = item.margin < threshold;
                        const diff = item.margin - threshold;
                        return (
                          <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3.5 px-6 font-semibold text-slate-900">{item.fullName}</td>
                            <td className="py-3.5 px-6">{item.count} quotes</td>
                            <td className="py-3.5 px-6">
                              <span
                                className={`font-bold text-sm ${isLow ? 'text-rose-600' : 'text-indigo-600'}`}
                              >
                                {item.margin}%
                              </span>
                            </td>
                            <td className="py-3.5 px-6">
                              {isLow ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                                  <AlertTriangle className="h-3 w-3" /> Below Threshold
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                                  <CheckCircle2 className="h-3 w-3" /> Healthy Margin
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-6 text-right font-semibold">
                              <span className={diff >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                                {diff >= 0 ? `+${diff}%` : `${diff}%`}
                              </span>
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
            <div className="p-3.5 px-6 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs text-slate-500 flex-shrink-0">
              <span>Showing {processedData.length} service categories</span>
              <button
                onClick={() => setIsExpanded(false)}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-colors"
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


