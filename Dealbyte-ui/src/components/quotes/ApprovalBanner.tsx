'use client';

import React from 'react';
import { AlertTriangle, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { QuoteStatus } from '@/lib/api/quotes';

interface ApprovalBannerProps {
  status: QuoteStatus;
  approvalRequests?: Array<{
    id: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    reason?: string;
    approver?: { name: string };
  }>;
  onSubmitApproval?: () => void;
  isSubmitting?: boolean;
}

export default function ApprovalBanner({
  status,
  approvalRequests = [],
  onSubmitApproval,
  isSubmitting = false,
}: ApprovalBannerProps) {
  const latestReq = approvalRequests[0];

  if (status === 'APPROVED') {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
          <div>
            <h4 className="font-bold text-emerald-900 text-sm">Quote Pre-Approved & Ready</h4>
            <p className="text-xs text-emerald-700">
              This quote meets margin guidelines or has been approved by management.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'PENDING_APPROVAL') {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="h-6 w-6 text-amber-600 shrink-0 animate-pulse" />
          <div>
            <h4 className="font-bold text-amber-900 text-sm">Pending Manager Approval</h4>
            <p className="text-xs text-amber-700">
              Submitted to {latestReq?.approver?.name || 'Manager'} for margin/value threshold authorization.
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-amber-100 text-amber-800 rounded-full border border-amber-300">
          Awaiting Decision
        </span>
      </div>
    );
  }

  if (status === 'REJECTED') {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <XCircle className="h-6 w-6 text-rose-600 shrink-0" />
          <div>
            <h4 className="font-bold text-rose-900 text-sm">Quote Approval Rejected</h4>
            <p className="text-xs text-rose-700">
              {latestReq?.reason ? `Reason: ${latestReq.reason}` : 'Margin or terms were not authorized.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // DRAFT status requiring submission
  return (
    <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-6 w-6 text-slate-600 shrink-0" />
        <div>
          <h4 className="font-bold text-slate-900 text-sm">Draft Quote State</h4>
          <p className="text-xs text-slate-600">
            Submit for approval if margin thresholds are breached, or generate proposal if within limits.
          </p>
        </div>
      </div>
      {onSubmitApproval && (
        <button
          onClick={onSubmitApproval}
          disabled={isSubmitting}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors shrink-0 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit for Manager Approval'}
        </button>
      )}
    </div>
  );
}
