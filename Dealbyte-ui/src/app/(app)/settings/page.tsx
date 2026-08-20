'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Settings, Save, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { settingsApi } from '@/lib/api/settings';
import { useAuth } from '@/providers/AuthProvider';

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { hasRole } = useAuth();
  const isAdmin = hasRole('ADMIN');

  const [marginPct, setMarginPct] = useState('40');
  const [bufferPct, setBufferPct] = useState('10');
  const [marginThreshold, setMarginThreshold] = useState('25');
  const [valueThreshold, setValueThreshold] = useState('5000000');
  const [negotiationFloor, setNegotiationFloor] = useState('15');

  const { data: settings = [], isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsApi.getAll,
    enabled: isAdmin,
  });

  useEffect(() => {
    if (settings.length > 0) {
      settings.forEach((s) => {
        if (s.key === 'DEFAULT_MARGIN_PCT') setMarginPct(s.value);
        if (s.key === 'DEFAULT_BUFFER_PCT') setBufferPct(s.value);
        if (s.key === 'APPROVAL_MARGIN_THRESHOLD') setMarginThreshold(s.value);
        if (s.key === 'APPROVAL_VALUE_THRESHOLD') setValueThreshold(s.value);
        if (s.key === 'NEGOTIATION_MARGIN_FLOOR') setNegotiationFloor(s.value);
      });
    }
  }, [settings]);

  const bulkUpdateMutation = useMutation({
    mutationFn: settingsApi.bulkUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('System configuration saved successfully!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update settings');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    bulkUpdateMutation.mutate([
      { key: 'DEFAULT_MARGIN_PCT', value: marginPct },
      { key: 'DEFAULT_BUFFER_PCT', value: bufferPct },
      { key: 'APPROVAL_MARGIN_THRESHOLD', value: marginThreshold },
      { key: 'APPROVAL_VALUE_THRESHOLD', value: valueThreshold },
      { key: 'NEGOTIATION_MARGIN_FLOOR', value: negotiationFloor },
    ]);
  };

  if (!isAdmin) {
    return (
      <div className="bg-amber-50 p-8 rounded-2xl border border-amber-200 text-center max-w-md mx-auto my-12">
        <ShieldAlert className="h-12 w-12 text-amber-600 mx-auto mb-3" />
        <h3 className="font-bold text-amber-900">Admin Access Required</h3>
        <p className="text-xs text-amber-700 mt-1">
          System margin policies and approval thresholds can only be edited by System Administrators.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="h-6 w-6 text-indigo-600" /> System Settings & Margin Governance
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Configure baseline costing engine defaults, approval trigger floors, and high-value deal limits
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Costing Engine Defaults */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            1. Costing Engine Baseline Parameters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Default Standard Margin (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={marginPct}
                onChange={(e) => setMarginPct(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-indigo-600"
              />
              <p className="text-[11px] text-slate-400 mt-1">Applied automatically to subtotal on new quotes.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Default Quote Buffer (%)
              </label>
              <input
                type="number"
                min={0}
                max={50}
                value={bufferPct}
                onChange={(e) => setBufferPct(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-indigo-600"
              />
              <p className="text-[11px] text-slate-400 mt-1">Safety buffer calculated on top of cost + margin.</p>
            </div>
          </div>
        </div>

        {/* Manager Approval Threshold Controls */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            2. Mandatory Manager Approval Triggers
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Low-Margin Floor Threshold (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={marginThreshold}
                onChange={(e) => setMarginThreshold(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-rose-600"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Any quote with margin below this % requires manager approval before proposal export.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                High-Value Deal Threshold (₹)
              </label>
              <input
                type="number"
                min={0}
                step={100000}
                value={valueThreshold}
                onChange={(e) => setValueThreshold(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Final quote total above this amount automatically requires approval.
              </p>
            </div>
          </div>
        </div>

        {/* Sales Negotiation Governance */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
            3. Sales Negotiation Governance Floor
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Minimum Pre-Approved Negotiation Margin Floor (%)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={negotiationFloor}
              onChange={(e) => setNegotiationFloor(e.target.value)}
              className="w-full max-w-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-amber-600"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Sales Execs cannot lower the margin below this floor during client negotiation without fresh approval.
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={bulkUpdateMutation.isPending}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {bulkUpdateMutation.isPending ? 'Saving System Policies...' : 'Save System Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
