'use client';

import React, { useState } from 'react';
import { Sliders, RefreshCw, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';

interface NegotiationPanelProps {
  quoteId: string;
  currentMarginPct: number;
  subtotal: number;
  bufferPct: number;
  onNegotiate: (newMarginPct: number) => Promise<void>;
  isSubmitting?: boolean;
}

export default function NegotiationPanel({
  quoteId,
  currentMarginPct,
  subtotal,
  bufferPct,
  onNegotiate,
  isSubmitting = false,
}: NegotiationPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [targetMargin, setTargetMargin] = useState(currentMarginPct);

  const newMarginAmount = Math.round(subtotal * (targetMargin / 100));
  const newWithMargin = subtotal + newMarginAmount;
  const newBufferAmount = Math.round(newWithMargin * (bufferPct / 100));
  const newFinalQuote = newWithMargin + newBufferAmount;

  const handleApply = async () => {
    try {
      await onNegotiate(targetMargin);
      toast.success(`Negotiation margin updated to ${targetMargin}%!`);
      setIsOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update negotiation margin');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="h-5 w-5 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-sm">Negotiation Margin Adjustment</h3>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
        >
          {isOpen ? 'Close Adjustment' : 'Adjust Margin'}
        </button>
      </div>

      {isOpen && (
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>Target Negotiation Margin</span>
              <span className="text-indigo-600 font-bold">{targetMargin}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={60}
              step={1}
              value={targetMargin}
              onChange={(e) => setTargetMargin(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
              <span>10% (Floor)</span>
              <span>25% (Threshold)</span>
              <span>40% (Standard)</span>
              <span>60%</span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Original Margin:</span>
              <span className="font-semibold">{currentMarginPct}%</span>
            </div>
            <div className="flex justify-between text-slate-900 font-bold pt-1 border-t border-slate-200">
              <span>New Calculated Quote:</span>
              <span className="text-indigo-600">{formatCurrency(newFinalQuote)}</span>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={isSubmitting}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              {isSubmitting ? (
                'Updating...'
              ) : (
                <>
                  <RefreshCw className="h-3.5 w-3.5" /> Apply & Recalculate
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
