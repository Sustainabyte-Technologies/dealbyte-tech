'use client';

import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface QuoteSummaryProps {
  manpowerCost: number;
  instrumentCost: number;
  hardwareCost?: number;
  foodTravelCost: number;
  subtotal: number;
  marginPct: number;
  marginAmount: number;
  bufferPct: number;
  bufferAmount: number;
  finalQuote: number;
  requiresApproval?: boolean;
  approvalReasons?: string[];
  status?: string;
}

export default function QuoteSummaryCard({
  manpowerCost,
  instrumentCost,
  hardwareCost = 0,
  foodTravelCost,
  subtotal,
  marginPct,
  marginAmount,
  bufferPct,
  bufferAmount,
  finalQuote,
  requiresApproval = false,
  approvalReasons = [],
  status,
}: QuoteSummaryProps) {
  return (
    <div className="bg-[#0D1B3C] text-white rounded-2xl p-6 shadow-2xl border border-slate-800 space-y-6 overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-extrabold text-base tracking-tight text-white">Live Cost Summary</h3>
          <p className="text-xs text-slate-400">Automated Costing Engine Breakdown</p>
        </div>
        {status && (
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
              status === 'APPROVED'
                ? 'bg-[#3BD98E]/20 text-[#3BD98E] border border-[#3BD98E]/30'
                : status === 'PENDING_APPROVAL'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : status === 'REJECTED'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            {status.replace('_', ' ')}
          </span>
        )}
      </div>

      {/* Cost Rows */}
      <div className="space-y-3 text-xs">
        <div className="flex justify-between items-center text-slate-300">
          <span>Manpower Costs</span>
          <span className="font-semibold text-white">{formatCurrency(manpowerCost)}</span>
        </div>

        <div className="flex justify-between items-center text-slate-300">
          <span>Instrument Rentals</span>
          <span className="font-semibold text-white">{formatCurrency(instrumentCost)}</span>
        </div>

        {hardwareCost > 0 && (
          <div className="flex justify-between items-center text-slate-300">
            <span>Hardware Items</span>
            <span className="font-semibold text-white">{formatCurrency(hardwareCost)}</span>
          </div>
        )}

        <div className="flex justify-between items-center text-slate-300">
          <span>Food & Travel Allowance</span>
          <span className="font-semibold text-white">{formatCurrency(foodTravelCost)}</span>
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-slate-200 font-medium">
          <span>Subtotal Cost</span>
          <span className="text-sm font-bold text-white">{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex justify-between items-center text-[#3BD98E]">
          <span>Margin ({marginPct}%)</span>
          <span className="font-semibold">+ {formatCurrency(marginAmount)}</span>
        </div>

        <div className="flex justify-between items-center text-indigo-400">
          <span>Quote Buffer ({bufferPct}%)</span>
          <span className="font-semibold">+ {formatCurrency(bufferAmount)}</span>
        </div>
      </div>

      {/* Final Quote Total - Clean Bottom Container without negative margin overflow */}
      <div className="pt-4 border-t border-slate-800 bg-[#071026] -mx-6 p-6 rounded-b-2xl space-y-2">
        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Final Calculated Quote</p>
        <div className="text-3xl font-black text-[#3BD98E] tracking-tight">
          {formatCurrency(finalQuote)}
        </div>

        {/* Approval Warning Notice */}
        {requiresApproval && (
          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-amber-400">
              <ShieldAlert className="h-4 w-4 shrink-0" /> Requires Manager Approval
            </div>
            {approvalReasons.map((reason, idx) => (
              <p key={idx} className="text-[11px] text-amber-200/80 leading-snug">
                • {reason}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
